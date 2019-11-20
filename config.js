const projectPath = new Map();
// 算法
projectPath.set("frontalgo", {
  path: "/root/html/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "pm2 stop frontalgo && pm2 serve /root/html/frontalgo/dist/ 8090 --name frontalgo"
});

module.exports.projectPath = projectPath;

module.exports.listenPort = 8070;
