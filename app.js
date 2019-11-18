var http = require("http");
var shell = require("shelljs");
var { projectPath } = require("./config.js");

const port = 8070;

http
  .createServer((require, response) => {
    let requestConfig = undefined;
    require.on("data", data => {
      const buffer = Buffer.from(data);
      const jsonobj = JSON.parse(buffer.toString());
      const config = projectPath.get(jsonobj.project_id);
      console.log(buffer.toString());
      const ref = jsonobj.ref ? jsonobj.ref.split("/")[2] : 0;
      console.log("ref = ", ref);
      if (config && ref === config.releaseBranch) {
        requestConfig = config;
      } else {
        console.error(
          `error: project: ${jsonobj.repository.name} 没有配置该项目相关路径`
        );
      }
    });
    response.on("finish", () => {
      if (requestConfig) {
        shell.cd(requestConfig.path);
        // 执行git pull
        shell.exec(`git pull origin ${requestConfig.releaseBranch}`);
        // 执行编译
        shell.exec(requestConfig.buildScript);
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
