# 新建一个项目

## 初始化项目
&emsp;&emsp;首先新建一个文件夹（名称随意，此处为webpackdocument）作为代码存放地点，用编辑器（随意，此处为vscode）打开这个文件夹，在该目录下终端输入指令初始化项目：
``` sh
    npm init -y
```
&emsp;&emsp;执行成功后终端输出显示如下的项目基本信息:
``` sh
    {
        "name": "webpackdocument",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }
```

## 安装webpack
&emsp;&emsp;我们先来本地安装webpack，即是在项目内安装，这样安装的依赖独属于这个项目。因为当下webpack已经是4+版本，所以除了安装webpack，还需要安装CLI（不安装走不下去=。=）。
``` sh
    cnpm install --save-dev webpack webpack-cli
```

::: tip 提示
&emsp;&emsp;下载工具不一定非要cnpm不可，npm、yarn都是可以的，我们的目的只是要下载这几个依赖包，这里用cnpm只是用顺手，同时又因为翻墙是不可能翻墙的，网络受限，蓝灯、XX-net不稳定，又没钱充vip，只能用用国内镜像才能进行下去的样子。
:::

&emsp;&emsp;安装成功后的package.json应当是这样子的，可以看到当前webpack版本为<font color=#007acc>"^4.20.2"</font>,就是说大于4.20.2小于5的当前最新版本，当然，因为安装这个包的时候没有带上版本号，所以4.20.2应当是此时webpack的最新版本。cli的版本为<font color=#007acc>"^3.1.1"</font>
