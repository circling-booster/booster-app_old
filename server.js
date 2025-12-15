// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  // 브라우저에 HTML + UTF-8 헤더 전송
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  // 화면에 hello 출력
  res.end('<h1>hello</h1>');
});

// 3000번 포트에서 서버 시작
server.listen(3000, () => {
  console.log('http://localhost:3000 에서 접속하세요');
});
