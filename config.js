const projectPath = new Map();
// 算法
projectPath.set("frontalgo", {
  path: "/root/html/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "rm -rf /usr/share/nginx/frontalgo/* && mv /root/html/frontalgo/dist/* /usr/share/nginx/frontalgo/ && nginx -s reopen"
});

module.exports.projectPath = projectPath;

module.exports.listenPort = 8070;
