const projectPath = new Map();
// 算法
projectPath.set(222375795, {
  path: "/root/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "pm2 stop frontalgo && pm2 serve /root/frontalgo/dist/ 8090 --name frontalgo"
});

module.exports.projectPath = projectPath;
