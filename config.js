const projectPath = new Map();
// 算法
projectPath.set("frontalgo", {
  path: "/root/html/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "rm -rf /usr/share/nginx/frontalgo/* && mv /root/html/frontalgo/dist/* /usr/share/nginx/frontalgo/ && nginx -s reopen"
});

// 博客
projectPath.set("hanbaoblog", {
  path: "/root/html/hanbaoblog/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "rm -rf /usr/share/nginx/hanbaoblog/* && mv /root/html/hanbaoblog/public/* /usr/share/nginx/hanbaoblog/ && nginx -s reopen"
});

module.exports.projectPath = projectPath;

module.exports.listenPort = 8070;

module.exports.generateScripts = ({
  path,
  releaseBranch,
  buildScript,
  publishScript
}) => [
  {
    index: 1,
    path: true,
    content: path,
    description: "进入目录"
  },
  {
    index: 2,
    content: `git pull origin ${releaseBranch}`,
    description: "拉取最新代码"
  },
  {
    index: 3,
    content: "cnpm i",
    description: "安装依赖"
  },
  {
    index: 4,
    content: buildScript,
    description: "构建项目"
  },
  {
    index: 5,
    content: publishScript,
    description: "发布项目"
  }
];
