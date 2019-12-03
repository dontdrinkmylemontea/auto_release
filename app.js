var http = require("http");
var shell = require("shelljs");
var { projectPath, listenPort } = require("./config.js");
var moment = require("moment");

// 1
http
  .createServer((request, response) => {
    let data = "";
    request.on("data", buf => {
      data += buf;
    });

    request.on("end", () => {
      let requestConfig = undefined;
      console.log(data);
      const jsonobj = JSON.parse(Buffer.from(data).toString());
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
        console.log(
          `-----------开始发布：${moment().format(
            "MMMM Do YYYY, h:mm:ss a"
          )}-----------`
        );
        shell.cd(requestConfig.path);
        // 执行git pull
        shell.exec(`git pull origin ${requestConfig.releaseBranch}`);
        // 安装依赖
        // shell.exec("cnpm i");
        // 执行编译
        // shell.exec(requestConfig.buildScript);
        // 执行部署
        // shell.exec(requestConfig.publishScript);
        console.log(
          `-------------已完成发布${moment().format(
            "MMMM Do YYYY, h:mm:ss a"
          )}-----------`
        );
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("success");
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("没找到该项目的配置");
      }
    });
  })
  .listen(listenPort)
  .on("error", error => {
    console.error("error", error.message);
  });

console.log(`server running on http://localhost:${listenPort}`);
