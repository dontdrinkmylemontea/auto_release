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
        setImmediate(() => {
          shell.cd(config.path);
          // 执行git pull
          shell.exec(`git pull origin ${ref}`);
          // 执行编译
          const result = shell.exec(config.buildScript);
          console.log(result);
        });
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
