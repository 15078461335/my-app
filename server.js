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

// 配置项
const TOKEN = 'xiaozhangToken';
const APP_ID = 'wx204b30c5f21f9ee0';
const APP_SECRET = '65b87e58f6d7097ade75be126b2006dc';

let jsapiTicket = null;
let accessToken = null;
let tokenExpiresAt = 0;

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

    if (req.method === 'POST' && req.url === '/log') {
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

    if (req.method === 'GET' && (req.url.startsWith('/api/shareConfig') || req.url === '/')) {
        // 默认的 date 和 index
        const defaultDate = '20240820';
        const defaultIndex = '4';

        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        const date = req.url === '/' ? defaultDate : requestUrl.searchParams.get('date');
        const index = req.url === '/' ? defaultIndex : requestUrl.searchParams.get('index');

        console.log(`Fetching shareConfig for date: ${date}, index: ${index}`);  // Log

        const shareConfig = getShareConfigByDateAndIndex(date, index);
        if (shareConfig) {
            // 将HTML模板插入数据
            fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, html) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Server Error');
                    return;
                }

                // 替换HTML中的占位符
                html = html.replace(/{{title}}/g, shareConfig.title);
                html = html.replace(/{{description}}/g, shareConfig.description);
                html = html.replace(/{{imgUrl}}/g, shareConfig.imgUrl);
                html = html.replace(/{{records}}/g, JSON.stringify(shareConfig.records).replace(/\"/g, '\\"')); // 转义字符串中的双引号

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Data not found' }));
        }
        return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/wechat-qianming')) {
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

    if (req.method === 'GET' && req.url.includes('signature')) {
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

    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (error, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 设置静态文件目录
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
