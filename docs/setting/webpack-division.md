# 开发与生产环境区分

## 添加目录

&emsp;&emsp;开发环境和生产环境存在差异，除了必须都具备资源解析加载功能外，开发环境注重强大的实时重新加载能力以方便开发，而生产环境关注的是各方面的性能。在此，我们将生产环境跟开发环境做下区分，同时秉承不重复原则（DRY）,保留一个开发环境跟生产环境通用的配置，一个开发环境独有的配置和一个生产环境独有的配置。现下项目目录结构大抵是这样的：
```
webpackdocument
├─ build
│  ├─ webpack.common.js
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ node_modules
│  └─ ...
├─ src
│  └─ ...
├─ static
│  └─ ...
└─ package.json
```
&emsp;&emsp;新增一个build目录用来保存webpack配置文件，其中webpack.common.js文件用来书写通用配置，webpack.dev.js文件用来设置开发环境配置，webpack.prod.js文件记录生产环境设置。node_modules是各种第三方依赖包的集合，src存放我们的开发源代码

::: tip 提示
目录划分没有规定的结构，只是按照个人喜好与习惯而定，也可以在此基础上抽取出各个配置项组成一个配置变量对象，就像脚手架里多出来一个config目录，存放着自定义的变量对象，然后结合逻辑在各个文件里引用。目前简单一些就这样划分了。
:::

::: tip 提示
顺便说，webpack打包时会忽略位于根目录下的static目录里的文件，代码中如果需用到static中的文件，在打包时需要做些特殊处理。同样约定俗成的是，执行webpack打包命令时，webpack会自动读取位于根目录下的webpack.config.js文件，如果没有这个文件，webpack会读取内置的默认配置，因此在执行webpack命令时，若想要执行某些写好的配置文件，可以通过--config选项指定，在接下去的步骤里我们正是这样做的。  
官方文档现今没有对这些细节有过说明，或许在最开始的时候有过，但现在随着webpack的版本迭代，官方文档也一样在更新换代中丢失了这一部分也说不定。同时市面上也没有哪位技术君对此有详细的描述，只有在某些相关的技术文章上有过只言片语。最好就是抱着怀疑的态度去执行一遍，观察其事实表现。
:::

## 配置快捷指令

&emsp;&emsp;package.json中有个script对象用于自定义运行指令，结构为一对对的键值对，这样在终端运行命令的时候不用每一次都输入长长的一串:

``` json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack-dev-server --open --config build/webpack.dev.js --env=development",
        "dev": "npm start",
        "build": "webpack --config build/webpack.prod.js --env=production"
    }
```

&emsp;&emsp;这里的`--env=development`、`--env=production`不是必须的，在webpack3+时，某些配置需要根据不同环境来确定是否执行，像这样在命令行中传出环境变量就是其中的一种做法，这里就这样先保留了。