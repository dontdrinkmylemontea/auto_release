var http = require("http");
var shell = require("shelljs");
var { projectPath } = require("./config.js");

const port = 8080;

http
  .createServer((require, response) => {
    require.on("data", data => {
      const buffer = Buffer.from(data);
      const jsonobj = JSON.parse(buffer.toString());
      const config = projectPath.get(jsonobj.project_id);
      const ref = jsonobj.ref ? jsonobj.ref.split("/")[2] : 0;
      if (config && ref === config.releaseBranch) {
        shell.cd(config.path);
        // 执行git pull
        shell.exec("git pull origin master");
        // 删除编译文件
        // shell.exec("rm -rf ./build");
        // 执行编译
        shell.exec(config.buildScript);
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
