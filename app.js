var http = require("http");
var shell = require("shelljs");

// 根据配置文件判断位置
// import {projectPath} from './config.js';

const port = 8080;

http
  .createServer((require, response) => {
    console.log("in server...");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World\n");
    require.on("data", data => {
      const buffer = Buffer.from(data);
      const str = buffer.toString();
      console.log(str);
      if (str) {
        const res1 = shell.cd("/home/bmap_doc/");
        console.log("res1", res1);
        // 执行git pull
        const result = shell.exec("git pull origin master");
        console.log(result);
        // 删除编译文件
        shell.exec("rm -rf ./build");
        // 执行编译
        shell.exec("npm run build");
      }
    });
  })
  .listen(port)
  .on("error", error => {
    console.error("error", error.message);
  });

console.log(`server running on http://localhost:${port}`);
