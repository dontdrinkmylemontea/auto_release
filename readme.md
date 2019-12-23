本项目用于配置自动化部署

### How to Start

1. 在项目中配置 webhook
2. 配置本项目

### 配置说明

```
projectPath.set("frontalgo", {
  path: "/root/html/frontalgo/",
  releaseBranch: "master",
  buildScript: "npm run build",
  publishScript:
    "pm2 stop frontalgo && pm2 serve /root/frontalgo/dist/ 8090 --name frontalgo"
});

```

"frontalgo" : 项目名称
"path": 项目在服务器上的地址
"releaseBranch": 项目所在分支
"buildScript": 项目编译命令
"publishScript": 项目部署命令

// 测试测试
