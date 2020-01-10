var http = require("http");
var shell = require("shelljs");
var { projectPath, listenPort, generateScripts } = require("./config.js");
var moment = require("moment");

gettime = () => `[${moment().format("MMMM Do YYYY, h:mm:ss a")}]`;

divider = title => console.log(`-----------${title} ${gettime()}-----------`);

logger = content => console.log(`${gettime()} ${content}`);

execShellScript = configure => {
  const scripts = generateScripts(configure);
  scripts.forEach(({ path, content, description }) => {
    const func = path ? "cd" : "exec";
    if (content) {
      logger(`开始${description}……`);
      shell[func](content);
    }
  });
};

http
  .createServer((request, response) => {
    let data = "";

    function setError(errorCode, errorMessage, printData) {
      divider("ERROR");
      console.error(errorMessage);
      console.log("printData = ");
      console.log(printData);
      divider("ERROR");
      response.writeHead(errorCode, { "Content-Type": "text/plain" });
      response.end(errorMessage, "UTF-8");
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
      console.log(projectPath, config, ref);
      if (config && ref === config.releaseBranch) {
        requestConfig = config;
      } else {
        console.error(
          `错误: 项目【${jsonobj.repository.name}】没有配置该项目相关路径`
        );
      }
      if (requestConfig) {
        divider("开始发布");
        execShellScript(requestConfig);
        logger(commit);
        divider("完成发布");
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
