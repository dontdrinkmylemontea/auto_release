var http = require("http");
var shell = require("shelljs");
var { projectPath } = require("./config.js");

const port = 8080;

http
  .createServer((require, response) => {
    require.on("data", data => {
      const buffer = Buffer.from(data);
      const jsonobj = JSON.parse(buffer.toString());
      const path = projectPath.get(jsonobj.project_id);
      if (path) {
        const res1 = shell.cd("/home/bmap_doc/");
        console.log("res1", res1);
        // 执行git pull
        const result = shell.exec("git pull origin master");
        console.log(result);
        // 删除编译文件
        shell.exec("rm -rf ./build");
        // 执行编译
        const buildresult = shell.exec("npm run build");
        console.log("-------------buildresult:--------------");
        console.log(buildresult);
        console.log("-----------------------------------------");
      } else {
        console.error(
          `error: project: ${jsonobj.repository.name} 没有配置该项目相关路径`
        );
      }
    });
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("success");
  })
  .listen(port)
  .on("error", error => {
    console.error("error", error.message);
  });

console.log(`server running on http://localhost:${port}`);
