const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');
const jsSHA = require('jssha');
const axios = require('axios');
const { baseUrl } = require('./config');

// 动态加载对应的data文件
function getShareConfigByDateAndIndex(date, index) {
    try {
        // 根据你的文件命名规则，动态构建文件名
        const fileName = `data_${date}_${index}.js`; 
        const shareConfig = require(`./alldata/${fileName}`);
        return shareConfig;
    } catch (error) {
        console.error(`Failed to load data file for date: ${date}, index: ${index}`, error);
        return null;
    }
}

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

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/wechat')) {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const signature = requestUrl.searchParams.get('signature');
    const timestamp = requestUrl.searchParams.get('timestamp');
    const nonce = requestUrl.searchParams.get('nonce');
    const echostr = requestUrl.searchParams.get('echostr');

    console.log('Full request URL:', req.url);
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
      console.error('Verification failed. Signature does not match.');
      res.end('Verification failed');
    }
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/shareConfig')) {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const date = requestUrl.searchParams.get('date');
    const index = requestUrl.searchParams.get('index');

    const shareConfig = getShareConfigByDateAndIndex(date, index);
    if (shareConfig) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(shareConfig));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Data not found' }));
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
