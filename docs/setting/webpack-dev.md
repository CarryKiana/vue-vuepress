# 开发配置
&emsp;&emsp;开发环境下，为方便边写边调，我们需要一个能及时重新编译、实时重新加载的工具；同时，错误追踪能力也是挺重要的。  
&emsp;&emsp;幸运的是，webpack提供了`source map`的功能，就是让编译后的代码跟原始源代码建立起映射，一旦编译后的代码出现问题，可以很方便的定位到原始源代码中问题产生的位置。`source map`的不同选项代表了目标代码跟原始源代码间映射的精确程度，某些选项也只是用在特定的场景下，定位越是精确则产生的映射map文件越是庞大，故在精确定位与性能间应当权衡。  
&emsp;&emsp;而对于提供重新加载的开发工具，目前有三种方式可供选择：  
&emsp;&emsp;内置的`webpack观察模式`：输入指令`webpack --watch`即可启用。缺点是即便每次保存修改后的代码，被改动的模块在观察模式下会自动重新编译，你还是必须刷新浏览器才能看到效果。
&emsp;&emsp;开发服务器`webpack-dev-server`：在本地搭建一个简单的webpack服务器，只需配置几个选项，即可实现上述功能，懒人专用。  
&emsp;&emsp;开发中间件`webpack-dev-middleware`：需要自己搭配第三方服务器，配置更灵活。

## 开始
&emsp;&emsp;之前我们已经创建了一个位于build文件夹下名为`webpack.dev.js`的文件专门用来编写适用于开发环境的配置，同时，在`package.json`文件中规定了启动开发环境所运行的命令:  
``` json
"scripts": {
"start": "webpack-dev-server --open --config build/webpack.dev.js --env=development"
}
```
&emsp;&emsp;这里的意思是运行本地开发服务器，以`--`开头的都是传入的配置，大多数配置都可以经由命令行写入覆盖默认的或者配置文件中的值，在此还可以传入自定义的环境变量，如`--env`。  

## 安装
&emsp;&emsp;由于我们把分离出了通用配置文件，在运行开发配置时需要把各项配置进行合并,先让我们安装本地服务器插件`webpack-dev-server`以及配置合并插件`webpack-merge`。  
``` sh
cnpm install --save-dev webpack-dev-server webpack-merge
```
## 写入
&emsp;&emsp;因为使用了`webpack-merge`，配置文件不再导出一个配置对象，而是导出一个返回配置对象的函数：  
``` js
const merge = require('webpack-merge'); // 引入混合插件
const common = require('./webpack.common.js'); // 引入通用配置文件

module.exports = env => { // 导出配置函数，env是从命令行传入的环境变量，webpack3+时可用来协助判断
    return merge(common, {
        devtool: 'inline-source-map' // 目标代码与源码的映射方式
    })
}
```
&emsp;&emsp;神奇的是，在webpack4中，这样什么都不配置，本身就已经自带了热重载功能，不用装载webpack热重载插件，不用打开热重载开关，开关`hot`已然无效!但是为了体现是从webpack3+的配置过渡而来，这里依旧会写上（尽管没什么卵用233...）。因此，整体配置应当是这样的：  
``` js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = env => {
    return merge(common, {
        devtool: 'inline-source-map',
        devServer: {
            hot: true // 热重载开关（已失效）
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin() // webpack3+热重载必需的插件（已失效）
        ]
    })
}
```
## 各项配置介绍与优化
&emsp;&emsp;devServer选项还有很多配置项，可以根据喜好按需配置，比如开发服务器配置就可以是这样的：  
``` js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = env => {
    return merge(common, {
        devtool: 'inline-source-map',
        devServer: {
            hot: true,
            contentBase: './dist', // 告诉服务器从哪里提供内容，只有在想要提供静态文件时才需要，publicPath用于确定应该从哪里提供bundle，并以此选项优先，推荐使用绝对路径
            compress: true, // 一切服务都启用gzip压缩
            historyApiFallback: { // 当使用HTML5 History API时，任意的404响应都被以下规则替代
                rewrites: [{
                    from: /.*/, // 匹配任意来源
                    to: './dist/index.html' // 导向index文件
                }]
            },
            host: '192.168.1.249', // 指定使用一个host，默认为localhost，若希望服务器外部可访问，可配为0.0.0.0
            port: 8080, // 指定要监听请求的端口号，不指定的话默认从8080开始，被占用则递增，而在指定时，若host相同，port被占用则会报错
            overlay: { // 是否显示警告信息，默认为overlay: false，按一下配置时若有警告信息，则会在浏览器显示
                warnings: true,
                errors: true
            },
            proxy: {}, // 服务器代理，解决接口跨域限制
            // quiet: true, // 启动后除初始启动信息外任何内容都不会被打印到控制台，来自webpack的错误与警告也不可见
            // openPage: './dist/index.html', // 指定自动在浏览器打开的页面
            // progress: '' // 将运行进度输出到控制台，只用于命令行（cli）
        },
        mode: 'development',
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    })
}
```
&emsp;&emsp;需要注意的是，webpack4新增了模式`mode`的配置，如果没有指定，运行时控制台会输出一连串警告（黄黄的一大片,游戏体验极差），故而开发环境下指定为`development`，效果相当于webpack3+时如下的配置：
``` js
plugins:[
    new webpack.NamedModulesPlugin(), // 显示模块的相对路径
    new webpack.DefinePlugin({ // 配置全局常量
        'process.env.NODE_ENV': JSON.stringify('development')
    })
]
```
## 存在问题与体验增强
&emsp;&emsp;显而易见的，当前体验较差的地方如下：  
1. 每一次更改开发代码，都会把重新编译过程的日志输出到控制台，这对于我们是不必要的；
2. host固定为一个ip地址，协同开发时不可避免的都需要更改；
3. port被固定，端口冲突时不对自动顺延。  

### 优化控制台输出
&emsp;&emsp;对于编译信息，我们可以设置devServer的`quiet`来阻止输出，但是这意味着控制台将一片空白，我们将不知道程序究竟是运行成功还是出错。因此我们引入友好提示插件`friendly-errors-webpack-plugin`来让控制台只给我们成功或者错误的提示，引入信息提示插件`node-notifier`让程序在出错的时候能以桌面提示的形式报告详情： 
``` sh
cnpm install --save-dev friendly-errors-webpack-plugin node-notifier
``` 
``` js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path'); // 引入路径解析模块
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // 引入友好提示插件
const notifier = require('node-notifier'); // 引入桌面提示插件

module.exports = env => {
    return merge(common, {
        devtool: 'inline-source-map',
        devServer: {
            // ...其余的在此省略不显示
            quiet: true, // 信息不打印到控制台
        },
        mode: 'development',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin({ // 友好提示插件配置
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://192.168.1.249:8080`]
                },
                onErrors: (serverity, errors) => {
                    if (serverity !== 'error') {
                        return
                    }
                    const error = errors[0]
                    const filename = error.file && error.file.split('!').pop()
                    notifier.notify({ // 桌面提示
                        title: 'project error',
                        message: serverity + ': ' + error.name,
                        subtitle: filename || '',
                        icon: path.join(__dirname, '../src/icon.png')
                    })
                }
            })
        ]
    })
}
```
展示效果如图：  

![消息提示效果](/notify.png 'notify')

### 动态获取IP地址
&emsp;&emsp;获取ip地址需要利用node环境下的操作系统模块,让我们在配置文件夹`build`下先创建一个名为`utils.js`的用来存放配置辅助函数的文件：
``` js
// 获取本地ip地址
exports.getLocalIpAddress = () => {
    const os = require('os'); // 引用文件系统模块
    let interfaces = os.networkInterfaces() // 获取ip地址集合
    let localIpaddress
    for (let devName in interfaces) {
        interfaces[devName].forEach((item) => { 
            if (item.family == 'IPv4' && !item.internal) {
                // 过滤符合条件的iP
                localIpaddress = item.address
            }
        })
    }
    return localIpaddress
}
```
&emsp;&emsp;在开发配置文件中导入辅助函数并使用:  
``` js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const utils = require('./utils.js'); // 导入辅助工具

module.exports = env => {
    return merge(common, {
        devtool: 'inline-source-map',
        devServer: {
            hot: true,
            contentBase: './dist',
            compress: true,
            historyApiFallback: {
                rewrites: [{
                    from: /.*/,
                    to: './dist/index.html'
                }]
            },
            host: utils.getLocalIpAddress() || 'localhost', // 动态获取ip，在获取不到的情况下（断网兼ip动态获取时）会返回undefined，给个默认值
            port: 8080,
            overlay: {
                warnings: true,
                errors: true
            },
            proxy: {},
            quiet: true
        },
        mode: 'development',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${ utils.getLocalIpAddress() || 'localhost'}:8080`]
                },
                onErrors: (serverity, errors) => {
                    if (serverity !== 'error') {
                        return
                    }
                    const error = errors[0]
                    const filename = error.file && error.file.split('!').pop()
                    notifier.notify({
                        title: 'project error',
                        message: serverity + ': ' + error.name,
                        subtitle: filename || '',
                        icon: path.join(__dirname, '../src/icon.png')
                    })
                }
            })
        ]
    })
}
```
### 端口自动递增