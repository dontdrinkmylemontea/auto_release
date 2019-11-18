const projectPath = new Map();
// bmap文档
projectPath.set(308567, {
  path: "/home/bmap_doc/",
  releaseBranch: "master",
  buildScript: "npm run build"
});

// 算法
projectPath.set(308567, {
  path: "/home/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build"
});

module.exports.projectPath = projectPath;
