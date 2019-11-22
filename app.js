var http = require("http");
var shell = require("shelljs");
var { projectPath, listenPort } = require("./config.js");

http
  .createServer((request, response) => {
    if (!request.body) {
      console.log(request.body);
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("请输入项目名称");
      return;
    }
    let requestConfig = undefined;
    const jsonobj = JSON.parse(request.body);
    const config = projectPath.get(jsonobj.repository.name);
    const ref = jsonobj.ref ? jsonobj.ref.split("/")[2] : 0;
    if (config && ref === config.releaseBranch) {
      requestConfig = config;
    } else {
      console.error(
        `error: project: ${jsonobj.repository.name} 没有配置该项目相关路径`
      );
    }
    if (requestConfig) {
      shell.cd(requestConfig.path);
      // 执行git pull
      shell.exec(`git pull origin ${requestConfig.releaseBranch}`);
      // 执行编译
      shell.exec(requestConfig.buildScript);
      // 执行部署
      shell.exec(requestConfig.publishScript);
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("success");
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("没找到该项目的配置");
    }
  })
  .listen(listenPort)
  .on("error", error => {
    console.error("error", error.message);
  });

console.log(`server running on http://localhost:${listenPort}`);
