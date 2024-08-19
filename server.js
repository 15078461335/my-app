const http = require('http');
const fs = require('fs');
const path = require('path');

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
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'GET' && req.url.startsWith('/images/')) {
    // 提供静态图片文件服务
    fs.readFile(path.join(__dirname, req.url), (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(content);
      }
    });
  } else if (req.method === 'GET' && req.url === '/api/records') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(chatRecords));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
