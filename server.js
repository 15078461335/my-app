const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');  // 引入url模块，用于解析URL

// 微信公众号验证所需的Token
const TOKEN = 'myToken'; // 请替换为您在微信公众号后台设置的Token

// 模拟的动态数据，使用本地图片路径
let chatRecords = [
  {
    user: "你是好人",
    avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
    numbers: `219期 新澳三中三 16-19-30 03-22-33 06-17-38 40-08-01 07-25-42 44-48-11 27-29-34
    32-26-03 16-30-43 32-43-11 49-23-07 23-05-32 26-44-07 15-32-49 10-25-30 21-32-14
    48-22-32 33-23-15 05-10-34 38-40-43 17-32-26 12-43-38 08-13-43 40-33-15 29-26-08
    42-43-10 03-32-12 32-15-19 05-14-30 17-22-08 14-18-25 02-44-15 18-25-09 14-42-45
    17-30-46 35-38-42 15-18-38 05-06-38 26-15-42 08-29-34 10-30-08 15-18-26 14-31-46
    14-30-35 05-38-30 25-30-38 02-13-26 26-35-42 40-07-35 35-24-43 `,
    time: "2024年8月5日 20:35"
  },
  {
    user: "你是好人",
    avatar: "/images/zhangtuIcon.jpg", // 本地图片路径
    numbers: `06-34-28 35-29-30 16-22-27 19-46-40 31-22-04 40-34-03 43-10-16 40-15-13 10-28-19
    04-10-39 22-40-02 16-03-49 46-04-27 08-06-32 04-20-35 46-04-31 49-04-39 37-16-27
    15-05-47 24-27-10 04-19-34 13-28-03 46-04-27 16-07-46 39-13-40 08-46-15 27-49-16
    40-31-10 17-37-40 03-25-28`,
    time: "2024年8月6日 21:19"
  }
];

// 创建一个HTTP服务器
const server = http.createServer((req, res) => {

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
