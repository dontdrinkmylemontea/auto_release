var http = require("http");
var shell = require("shelljs");
var { projectPath, listenPort } = require("./config.js");
var moment = require("moment");

http
  .createServer((request, response) => {
    let data = "";

    function setError(errorCode, errorMessage, printData) {
      console.log("------------ERROR---------------");
      console.error(errorMessage);
      console.log("printData = ");
      console.log(printData);
      console.log("------------ERROR---------------");
      response.writeHead(errorCode, { "Content-Type": "text/plain" });
      response.end(errorMessage, "utf-8");
    }

    request.on("data", buf => {
      data += buf;
    });

    request.on("end", () => {
      let requestConfig = undefined;
      let jsonobj = null;
      try {
        jsonobj = JSON.parse(Buffer.from(data).toString());
      } catch (e) {
        setError(400, "钩子数据转json失败！", data);
        return;
      }
      if (!(jsonobj.repository && jsonobj.repository.name)) {
        setError(400, "参数错误!", data);
        return;
      }
      const config = projectPath.get(jsonobj.repository.name);
      const commit = ((jsonobj.commits || [])[0] || {}).message;
      const ref = jsonobj.ref ? jsonobj.ref.split("/")[2] : 0;
      if (config && ref === config.releaseBranch) {
        requestConfig = config;
      } else {
        console.error(
          `错误: 项目【${jsonobj.repository.name}】没有配置该项目相关路径`
        );
      }
      if (requestConfig) {
        console.log(
          `-----------开始发布：【${moment().format(
            "MMMM Do YYYY, h:mm:ss a"
          )}】-----------`
        );
        shell.cd(requestConfig.path);
        // 执行git pull
        shell.exec(`git pull origin ${requestConfig.releaseBranch}`);
        // 安装依赖;
        shell.exec("cnpm i");
        // 执行编译;
        shell.exec(requestConfig.buildScript);
        // 执行部署;
        shell.exec(requestConfig.publishScript);
        console.log(`提交信息【${commit}】`);
        console.log(
          `-------------已完成发布【${moment().format(
            "MMMM Do YYYY, h:mm:ss a"
          )}】-----------`
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
