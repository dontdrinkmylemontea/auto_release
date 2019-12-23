const projectPath = new Map();

const projectCodePath = "/root/html/nice/"; // 项目源代码目录
const nginxSourcePath = "/usr/share/nginx/"; // nginx 压缩文件目录

const getGeneraConfig = projectName => ({
  path: `${projectCodePath}${projectName}/`,
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript: `rm -rf ${nginxSourcePath}${projectName}/* && mv ${projectCodePath}${projectName}/dist/* ${nginxSourcePath}${projectName}/ && nginx -s reopen`
});

const projectNames = ["frontalgo", "hanbaoblog", "shopwindow"];

projectNames.forEach(name => {
  projectPath.set(name, getGeneraConfig(name));
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
