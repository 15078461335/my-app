const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const jsSHA = require('jssha');
const axios = require('axios');

// 引入 data.js 模块
const { getChatRecords } = require('./data');

// 配置项
const TOKEN = 'myToken';
const APP_ID = 'wxda3ef9577ba6c47a';
const APP_SECRET = '4f5638680786707538b56d0e2478c7fd';

let jsapiTicket = null;
let accessToken = null;
let tokenExpiresAt = 0;

// 获取 access_token
async function getAccessToken() {
    if (Date.now() < tokenExpiresAt && accessToken) {
        return accessToken;
    }
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`);
    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in - 600) * 1000; // 提前10分钟更新
    return accessToken;
}

// 获取 jsapi_ticket
async function getJsapiTicket() {
    if (jsapiTicket) {
        return jsapiTicket;
    }
    const token = await getAccessToken();
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`);
    jsapiTicket = response.data.ticket;
    setTimeout(() => { jsapiTicket = null; }, (response.data.expires_in - 600) * 1000); // 提前10分钟更新
    return jsapiTicket;
}

// 获取模拟数据
let chatRecords = getChatRecords();

// 创建一个HTTP服务器
const server = http.createServer(async (req, res) => {

  // 微信服务器验证请求
  if (req.method === 'GET' && req.url.startsWith('/wechat')) {
    const queryObject = url.parse(req.url, true).query;  // 解析URL参数

    const signature = queryObject.signature;
    const timestamp = queryObject.timestamp;
    const nonce = queryObject.nonce;
    const echostr = queryObject.echostr;

    console.log('Received signature:', signature);
    console.log('Received timestamp:', timestamp);
    console.log('Received nonce:', nonce);
    console.log('Received echostr:', echostr);

    const hash = crypto.createHash('sha1');
    const arr = [TOKEN, timestamp, nonce].sort();
    hash.update(arr.join(''));

    const sha1 = hash.digest('hex');

    console.log('Calculated signature:', sha1);

    if (sha1 === signature) {
      res.end(echostr); // 验证成功，返回echostr
    } else {
      res.end('Verification failed');
    }
    return;
  }

  // JSSDK签名请求
  if (req.method === 'GET' && req.url.startsWith('/get-signature')) {
    const queryObject = url.parse(req.url, true).query;
    const pageUrl = queryObject.url;

    try {
        const jsapi_ticket = await getJsapiTicket();
        const nonceStr = 'randomString'; // 生成随机字符串
        const timestamp = Math.floor(Date.now() / 1000);

        // 生成签名
        const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${pageUrl}`;
        const shaObj = new jsSHA('SHA-1', 'TEXT');
        shaObj.update(string1);
        const signature = shaObj.getHash('HEX');

        // 返回签名数据
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            appId: APP_ID,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to generate signature' }));
    }
    return;
  }

  // 处理静态文件请求的代码
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  // 根据文件扩展名设置Content-Type
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

  // 读取文件并返回响应
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // 如果文件不存在，返回404
        fs.readFile(path.join(__dirname, '404.html'), (error, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404, 'utf-8');
        });
      } else {
        // 处理其他错误
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // 成功读取文件，返回内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });

  // API 路径处理
  if (req.method === 'GET' && req.url === '/api/records') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(chatRecords));
  }
});

// 设置端口并启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
