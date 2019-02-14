var http = require("http");
var shell = require("shelljs");
var { projectPath } = require("./config.js");

const port = 8080;

http
  .createServer((require, response) => {
    let requestConfig = undefined;
    console.log("in server");
    require.on("data", data => {
      console.log("get data");
      const buffer = Buffer.from(data);
      const jsonobj = JSON.parse(buffer.toString());
      const config = projectPath.get(jsonobj.project_id);
      const ref = jsonobj.ref ? jsonobj.ref.split("/")[2] : 0;
      if (config && ref === config.releaseBranch) {
        // setImmediate(() => {
        //   shell.cd(config.path);
        //   // 执行git pull
        //   shell.exec(`git pull origin ${ref}`);
        //   // 执行编译
        //   const result = shell.exec(config.buildScript);
        //   console.log("in immediate, result is", result);
        // });
        requestConfig = config;
      } else {
        console.error(
          `error: project: ${jsonobj.repository.name} 没有配置该项目相关路径`
        );
      }
    });
    response.on("finish", () => {
      console.log("finish sending response");
      if (requestConfig) {
        shell.cd(requestConfig.path);
        // 执行git pull
        shell.exec(`git pull origin ${requestConfig.releaseBranch}`);
        // 执行编译
        const result = shell.exec(requestConfig.buildScript);
        console.log("in immediate, result is", result);
      }
    });
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("success");
  })
  .listen(port)
  .on("error", error => {
    console.error("error", error.message);
  })
  .on("");

console.log(`server running on http://localhost:${port}`);
