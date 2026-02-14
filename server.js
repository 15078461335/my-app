const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');
const axios = require('axios');
const { baseUrl } = require('./config');
const express = require('express');
const wechat = require('./wechat');  // 已有的wechat.js模块
const app = express();  // app对象在这里被初始化
app.use(express.static('public'));

// 配置项
const TOKEN = 'xiaozhangToken';
const APP_ID = 'wx204b30c5f21f9ee0';
const APP_SECRET = '65b87e58f6d7097ade75be126b2006dc';

let jsapiTicket = null;
let accessToken = null;
let tokenExpiresAt = 0;
const HTML_TEMPLATE_TTL_MS = 60 * 1000;
const SHARE_CONFIG_TTL_MS = 5 * 60 * 1000;
const RENDERED_PAGE_TTL_MS = 30 * 1000;
const STATIC_ASSET_CACHE_CONTROL = 'public, max-age=604800, immutable';

let htmlTemplateCache = { content: null, expiresAt: 0 };
const shareConfigCache = new Map();
const renderedPageCache = new Map();

function normalizeBaseUrl(url) {
    if (!url) {
        return '';
    }
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function toAbsoluteUrl(url, base) {
    if (!url) {
        return '';
    }
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    const normalizedBase = normalizeBaseUrl(base).replace(/\/+$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${normalizedBase}${cleanPath}`;
}

function escapeForHtmlAttr(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function toMetaAttrMultiline(text) {
    return escapeForHtmlAttr(text).replace(/\r?\n/g, '&#10;');
}

function buildShareDescription(shareConfig) {
    const maxLines = 3;
    const maxCharsPerLine = 24;
    const trimLine = (text) => {
        const normalized = String(text || '').replace(/\s+/g, ' ').trim();
        if (normalized.length <= maxCharsPerLine) {
            return normalized;
        }
        return `${normalized.slice(0, maxCharsPerLine - 1)}…`;
    };

    if (Array.isArray(shareConfig.records) && shareConfig.records.length > 0) {
        return shareConfig.records
            .slice(0, maxLines)
            .map((record) => trimLine(`${record.user || ''}:${String(record.numbers || '').trim()}`))
            .join('\n');
    }
    return String(shareConfig.description || '')
        .replace(/\r?\n聊天记录\s*$/g, '')
        .split(/\r?\n/)
        .map((line) => trimLine(line))
        .filter(Boolean)
        .slice(0, maxLines)
        .join('\n');
}

function getRequestPath(req) {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    return requestUrl.pathname;
}

function getCachedShareConfig(date, index) {
    const key = `${date}:${index}`;
    const cached = shareConfigCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
    }

    const value = getShareConfigByDateAndIndex(date, index);
    if (value) {
        shareConfigCache.set(key, {
            value,
            expiresAt: Date.now() + SHARE_CONFIG_TTL_MS
        });
    }
    return value;
}

function getHtmlTemplate() {
    if (htmlTemplateCache.content && htmlTemplateCache.expiresAt > Date.now()) {
        return htmlTemplateCache.content;
    }

    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    htmlTemplateCache = {
        content: html,
        expiresAt: Date.now() + HTML_TEMPLATE_TTL_MS
    };
    return html;
}

function getContentTypeByExt(extname) {
    switch (extname) {
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        case '.json':
            return 'application/json';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.ico':
            return 'image/x-icon';
        case '.txt':
            return 'text/plain';
        default:
            return 'text/html';
    }
}

// 动态加载对应的data文件
function getShareConfigByDateAndIndex(date, index) {
    try {
        console.log(`Loading file for date: ${date}, index: ${index}`);  // Log
        const fileName = `data_${date}_${index}.js`;
        const shareConfig = require(`./alldata/${fileName}`);
        return shareConfig;
    } catch (error) {
        console.error(`Failed to load data file for date: ${date}, index: ${index}`, error);
        return null;
    }
}

// 获取 access_token
async function getAccessToken() {
    console.log('======getAccessToken');

    if (Date.now() < tokenExpiresAt && accessToken) {
        return accessToken;
    }
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`);
    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in - 600) * 1000; // 提前10分钟更新
    console.log(`Access token obtained: ${accessToken}`);  // Log
    return accessToken;
}

// 获取 jsapi_ticket
async function getJsapiTicket() {
    console.log('=====getJsapiTicket');

    if (jsapiTicket) {
        return jsapiTicket;
    }
    const token = await getAccessToken();
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`);
    jsapiTicket = response.data.ticket;
    setTimeout(() => { jsapiTicket = null; }, (response.data.expires_in - 600) * 1000); // 提前10分钟更新
    console.log(`Jsapi ticket obtained: ${jsapiTicket}`);  // Log
    return jsapiTicket;
}

const server = http.createServer(async (req, res) => {
    console.log(`进服务器的请求: ${req.url}`);  // Log
    const requestPath = getRequestPath(req);

    // 微信公众号验证专用文件处理
    if (req.method === 'GET' && requestPath === '/MP_verify_fXlWdCzWOutXlUjk.txt') {
        const filePath = path.join(__dirname, 'public', 'MP_verify_fXlWdCzWOutXlUjk.txt');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(content);
            }
        });
        return;
    }

    if (req.method === 'POST' && requestPath === '/log') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const logMessage = JSON.parse(body).message;
            console.log(`Client Log: ${logMessage}`);  // 在服务器端打印前端日志
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'Log received' }));
        });
        return;
    }

    if (req.method === 'GET' && (requestPath === '/api/shareConfig' || requestPath === '/')) {
        // 默认的 date 和 index
        const defaultDate = '20240820';
        const defaultIndex = '2';

        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        const date = requestPath === '/' ? defaultDate : (requestUrl.searchParams.get('date') || defaultDate);
        const index = requestPath === '/' ? defaultIndex : (requestUrl.searchParams.get('index') || defaultIndex);
        const pageCacheKey = `${date}:${index}:${req.url}`;
        const cachedPage = renderedPageCache.get(pageCacheKey);
        if (cachedPage && cachedPage.expiresAt > Date.now()) {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            res.end(cachedPage.html);
            return;
        }

        console.log(`Fetching shareConfig for date: ${date}, index: ${index}`);  // Log

        const shareConfig = getCachedShareConfig(date, index);
        if (shareConfig) {
            try {
                let html = getHtmlTemplate();
                const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
                const absoluteImageUrl = toAbsoluteUrl(shareConfig.imgUrl || '/images/zhandianIcon.jpg', normalizedBaseUrl);
                const currentPageLink = toAbsoluteUrl(req.url, normalizedBaseUrl);
                const isPlaceholderLink = !shareConfig.link || shareConfig.link === '/' || shareConfig.link === `${normalizedBaseUrl}/`;
                const absoluteShareLink = isPlaceholderLink
                    ? currentPageLink
                    : toAbsoluteUrl(shareConfig.link, normalizedBaseUrl);
                const shareDescription = buildShareDescription(shareConfig);
                const safeTitle = escapeForHtmlAttr(shareConfig.title);
                const safeDescription = toMetaAttrMultiline(shareDescription);
                const shareDataJson = JSON.stringify({
                    title: shareConfig.title,
                    desc: shareDescription,
                    link: absoluteShareLink,
                    imgUrl: absoluteImageUrl
                }).replace(/</g, '\\u003c');

                // 替换HTML中的占位符
                html = html.replace(/{{title}}/g, safeTitle);
                html = html.replace(/{{description}}/g, safeDescription);
                html = html.replace(/{{imgUrl}}/g, absoluteImageUrl);
                html = html.replace(/{{shareLink}}/g, absoluteShareLink);
                html = html.replace(/{{shareDataJson}}/g, shareDataJson);
                html = html.replace(/{{records}}/g, JSON.stringify(shareConfig.records).replace(/\"/g, '\\"')); // 转义字符串中的双引号

                renderedPageCache.set(pageCacheKey, {
                    html,
                    expiresAt: Date.now() + RENDERED_PAGE_TTL_MS
                });

                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache'
                });
                res.end(html);
            } catch (err) {
                console.error('Render page failed:', err);
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('Server Error');
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Data not found' }));
        }
        return;
    }

    if (req.method === 'GET' && requestPath === '/api/wechat-qianming') {
        console.log('微信签名请求 api/wechat-qianming');
        console.log('Before:', req.url);
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        console.log('After:', requestUrl.href);

        // 使用 'url=' 作为分隔符提取完整的 URL 参数
        const urlIndex = req.url.indexOf('url=');
        let fullUrl = null;

        if (urlIndex !== -1) {
            fullUrl = decodeURIComponent(req.url.substring(urlIndex + 4));
            console.log('完整URL:', fullUrl);
        } else {
            console.log('未找到 url 参数');
        }

        const jsapi_ticket = await getJsapiTicket();  // 获取jsapi_ticket
        const signatureData = wechat.generateSignature(jsapi_ticket, fullUrl);  // 调用wechat.js中的生成签名函数
        console.log('签名======', signatureData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            appId: APP_ID, // 直接使用你在server.js中定义的APP_ID变量
            timestamp: signatureData.timestamp,  // 从signatureData中提取时间戳
            nonceStr: signatureData.nonceStr,    // 从signatureData中提取随机字符串
            signature: signatureData.signature   // 从signatureData中提取签名
        }));

        return;
    }

    if (req.method === 'GET' && requestPath.includes('signature')) {
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        const signature = requestUrl.searchParams.get('signature');
        const timestamp = requestUrl.searchParams.get('timestamp');
        const nonce = requestUrl.searchParams.get('nonce');
        const echostr = requestUrl.searchParams.get('echostr');

        console.log('Full request URL:', req.url);  // Log
        console.log('Received signature:', signature);  // Log
        console.log('Received timestamp:', timestamp);  // Log
        console.log('Received nonce:', nonce);  // Log
        console.log('Received echostr:', echostr);  // Log

        // 按照字典序对 [TOKEN, timestamp, nonce] 排序
        const array = [TOKEN, timestamp, nonce];
        array.sort();

        // 拼接成一个字符串
        const str = array.join('');

        // 使用 SHA-1 算法生成签名
        const hash = crypto.createHash('sha1');
        hash.update(str);
        const sha1 = hash.digest('hex');

        console.log('Calculated signature:', sha1);  // Log

        // 比较服务器计算的签名和请求中的签名
        if (sha1 === signature) {
            res.end(echostr); // 验证成功，返回echostr
        } else {
            console.error('Verification failed. Signature does not match.');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Verification failed' })); //返回JSON格式的错误信息
        }
        return;
    }

    const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.join(__dirname, normalizedPath);
    const extname = path.extname(filePath);
    const contentType = getContentTypeByExt(extname);
    const isStaticAsset = ['.js', '.css', '.jpg', '.jpeg', '.png', '.ico', '.txt'].includes(extname);

    fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
            if (statErr.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (error, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content404 || 'Not Found', 'utf-8');
                });
                return;
            }
            res.writeHead(500);
            res.end(`Server Error: ${statErr.code}`);
            return;
        }

        const etag = `W/"${stats.size}-${Number(stats.mtimeMs)}"`;
        const ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch && ifNoneMatch === etag) {
            res.writeHead(304, {
                ETag: etag,
                'Last-Modified': stats.mtime.toUTCString(),
                'Cache-Control': isStaticAsset ? STATIC_ASSET_CACHE_CONTROL : 'no-cache'
            });
            res.end();
            return;
        }

        fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (error, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            const headers = {
                'Content-Type': contentType,
                ETag: etag,
                'Last-Modified': stats.mtime.toUTCString(),
                'Cache-Control': isStaticAsset ? STATIC_ASSET_CACHE_CONTROL : 'no-cache'
            };
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
    });
});

// 设置静态文件目录
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
