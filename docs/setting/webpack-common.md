# 书写通用配置文件

&emsp;&emsp;通用配置文件里配置程序入口文件和各类资源的解析加载处理，webpack就是根据入口文件（entry）逐步去构建依赖图的，入口有多种写法这里就不一一介绍了哈。资源加载器（loader）根据需求配置，默认的webpack只能识别并解析js文件，解析json文件也是内置的，但是像css、less、csv、xml、图片等就必须配置相应的加载器才能被正确的解析。我们将在通用的配置里处理这些需求。

## 输入输出
在webpack.common.js文件中写上如下代码：
``` js
const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js', //[name]对应的即是entry中各个key，刚开始先写死，以后会进一步处理
        path: path.resolve(__dirname, 'dist')
    }
}
```
&emsp;&emsp;我们的目的是让webpack能找到正确的入口文件，打包后然后输出到我们指定的位置上去。node环境下内置的path模块能为我们提供路径解析功能，指定入口文件为根目录下src文件夹下的main.js文件（文件名随意，这里只是为了方便以后跟脚手架做对比），按照我们的预期输出文件应当是位于根目录下跟src文件夹同级的dist文件夹下。  
&emsp;&emsp;为了验证webpack打包是否真的跟我们猜想一样，我们先创建一些文件来看看实际效果。示例中大多参照了webpack官方文档中的经典示例，方便跟官方教程联系起来。

## 创建编写验证文件
&emsp;&emsp;先安装一下通用类库lodash（鲁大师，~ =。= ~）,新建几个用来测试的文件main.js、log.js，入口文件是main.js,其中引用了功能文件中的工具函数：
1. 通用类库鲁大师（只是提供一些常用操作的封装，没用过的不必太在意）：
``` sh
cnpm install --save lodash
```
2. 在src下创建log.js文件，并书写如下代码：
``` js
export default function logText() {
    console.log('hello world');
}
```
3. 在src下创建main.js文件，编写代码，引用鲁大师跟工具函数：
``` js
import _ from 'lodash';
import logText from './log.js';

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = logText;
    element.appendChild(btn);
    return element;
}

document.body.appendChild(component());
```
## 运行检测
&emsp;&emsp;先临时在package.json中写个验证用的指令：
``` json
"common": "webpack --config build/webpack.common.js"
```
&emsp;&emsp;运行看输出：
``` sh
npm run common
```
``` sh
> webpackdocument@1.0.0 common E:\demo\webpack\webpackdocument
> webpack --config build/webpack.common.js

Hash: bd6ed9e4cea2d3a385cc
Version: webpack 4.20.2
Time: 249ms
Built at: 2018-09-28 17:50:16
        Asset      Size  Chunks             Chunk Names
app.bundle.js  70.6 KiB       0  [emitted]  app
Entrypoint app = app.bundle.js
[1] (webpack)/buildin/global.js 509 bytes {0} [built]
[2] (webpack)/buildin/module.js 519 bytes {0} [built]
[3] ./src/main.js + 1 modules 503 bytes {0} [built]
    | ./src/main.js 427 bytes [built]
    | ./src/log.js 71 bytes [built]
    + 1 hidden module
```
&emsp;&emsp;说明webpack已经正确找到入口，构建并输出完毕。然后我们查看一下生成的文件结构：
``` sh
webpackdocument
├─ build
│  └─ dist // 打包后的目录跑到这来了~
│     └─ ...
├─ node_modules
│  └─ ...
├─ src
│  └─ ...
├─ static
│  └─ ...
└─ package.json
```
&emsp;&emsp;我们希望的是在根目录下生成dist文件夹，而不是在配置文件夹build下输出文件，这明显与我们期望的不符，现在来看看输出配置:
``` js
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
```
&emsp;&emsp;配置文件webpack.common.js位于根目录下build文件夹中，<font color=#007acc>__dirname</font>（一个目录）是node环境下的全局变量，始终指向当前文件的绝对路径,也就是说，这里配置的是在当前文件（webpack.common.js）的目录下生成dist文件夹，这样一来就会出现上面的那一种情况，我们来做下改造，让dist生成在build目录外，跟src目录同级：
``` js
const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist') // 'dist' 改为 '../dist' 
    }
}
```
&emsp;&emsp;重新执行打包命令，现在就能在正确的位置上输出文件了。

## 查看效果  
&emsp;&emsp;文件已经生成，但我们要查看其是否正常运行挺不方便的，现在的html文件还没有自动生成，我们就暂时先在dist文件夹里添加一个html文件，这个html文件引用打包后的文件，之后再在浏览器中打开，查看效果。
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <script src="./app.bundle.js"></script>
</body>

</html>
```
&emsp;&emsp;网页展示如下：

![网页效果](/effect_0.png 'effect_0')

## 设定Html模板
&emsp;&emsp;上面的html其实写的只有`<script src="./app.bundle.js"></script>`这一句，其他的只是输入了一个`!+回车`由编辑器自动补全，而且手动去写html文件还是显得很low，同时如果设定的入口名称改了，输出文件名称也会跟着改，而html文件里引用的文件名是写死的，它并不会根据你配置文件的改动而改动，这里我们介绍个插件：`HtmlWebpackPlugin`,详情可以查看[中文文档](https://www.webpackjs.com/plugins/html-webpack-plugin/ '中文文档'),我们用它来动态生成html文件，具体的各项配置就不在这里一一说明了。用之前安装一下依赖包：
``` sh
cnpm install --save-dev html-webpack-plugin
```
&emsp;&emsp;之后再通用文件里引用并配置：
``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //引用

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'), //输出文件目录及名称
            template: 'index.html', //使用模板
            inject: true, //为true时生成的所有js文件会插入模板body标签内的最下方
            favicon: path.resolve('favicon.ico') //网页图标
        })
    ]
}
```
&emsp;&emsp;这里我们在根目录下放置了一个网页图标和一个html模板，生成的文件会插入到最终打包后的html中。模板文件中的内容可以被插件配置中的选项覆盖。模板文件长这样（其实也没多少内容，编辑器自动补全=。=）：
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>我是一个模板，我莫得感情~</title>
</head>

<body>
    <div id="app"></div>
</body>

</html>
```
&emsp;&emsp;现在我们再跑一下打包指令,查看输出,就可以看到webpack真真是根据模板来生成html文件，同时生成的js也按照预期的插入到html中了。

## 加载资源

&emsp;&emsp;webpack`是高度可配置的`,每每听到就给人一种`开局一条狗，装备全靠打`的既视感,node如是，webpack如是。我们想让webpack能识别各种类型的资源，就必须自己配置，webpack并不内置这种功能，当然资源格式种类繁多，就得看个人需求按需拓展（loader、plugin）。接下来我们就来让webpack能识别加载常见的资源,一般的套路就是需要加载什么类型格式的资源就去下载相对应的口碑好的加载器插件，然后根据插件文档写入到配置文件就可以了。

### 加载CSS
1. 安装插件
``` sh
cnpm install --save-dev style-loader css-loader
```
2. 在webpack.common.js文件中写入配置
``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            //解析顺序逆着来，先通过css-loader，在把结果流向style-loader
            // loader: 'style-loader!css-loader' // use的另一种写法
            use: [
                'style-loader',
                'css-loader'
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
            favicon: path.resolve('favicon.ico')
        })
    ]
}
```
3. 创建style.css文件
``` css
div {
    background-color: red;
}
```
4. 修改main.js,引入css文件
``` js
import _ from 'lodash';
import logText from './log.js';
import './style.css'; // 引入

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = logText;
    element.appendChild(btn);
    return element;
}

document.body.appendChild(component());
```
&emsp;&emsp;其中`css-loader`的作用是解析css文件，`style-loader`的作用是讲解析后的css转换成标签style的形式插入html中，你会发现生成的html中并没有这个style标签，这是因为代码混入了打包后的js文件里，如图：

![css-loader效果](/css_loader.png 'css-loader效果')

### 加载css预处理语言

&emsp;&emsp;我们在处理css资源的基础上，增加对预处理语言的处理，还是熟悉的配方：  
1.安装插件
``` sh
cnpm install --save-dev node-sass sass-loader
```
2. 写入配置
``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/, // 修改
            use: [
                'style-loader',
                'css-loader',
                'sass-loader' // 新增
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
            favicon: path.resolve('favicon.ico')
        })
    ]
}
```
3. 创建common.scss文件
``` scss
body {
    background-color: blue;

    div {
        border: 1px solid #000000;
    }
}
```
4. 修改main.js,引入scss文件
``` js
import _ from 'lodash';
import logText from './log.js';
import './style.css';
import './common.scss' // 引入

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = logText;
    element.appendChild(btn);
    return element;
}

document.body.appendChild(component());
```
&emsp;&emsp;`node-sass`是一个库，它为node提供解析预处理语言的能力；`sass-loader`是webpack的一个插件，底层引用的是`node-sass`,因此为处理css预处理语言，二者都是需要的。编译查看效果：

![scss-loader](/scss_loader.png 'scss-loader')

### 加载图片、字体

&emsp;&emsp;加载文件我们可以用`file-loader`或者`url-loader`，`file-loader`和`url-loader`可以用来加载任何类型的文件，`url-loader`是对`file-loader`的优化，它能设置一个阈值（limit），小于阈值的文件会编码成base64混入js代码中，大于阈值的文件会按照`file-loader`的方式处理，搬运到输出目录并替换成最终路径。这里就只演示`file-loader`插件啦。让我们安装插件，配置，并在网上顺些示例文件来验证配置：
1. 安装插件
``` sh
 cnpm install --save-dev file-loader
```

2. 配置
``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.(png|svg|jpg|gif)$/, // 图片
            loader: 'file-loader',
            options: {
                name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体
            loader: 'file-loader',
            options: {
                name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
            favicon: path.resolve('favicon.ico')
        })
    ]
}
```
&emsp;&emsp;`path.posix.join`用来按照系统平台格式（不同平台分隔符有可能不同）来拼装路径，`fonts/[name].[hash:7].[ext]`,`[name]`会替换成文件原有的名称，`[hash:7]`表示根据文件内容计算替换成7位哈希值，`[ext]`将替换成原文件后缀，打包构建出来的文件将会放在dist目录下，static目录中的fonts文件夹里。
3. 搞点对应类型的文件  
&emsp;&emsp;网上随便找找，下个字体文件。至于图片，截图就好。

4. 这里我们假装文件已经备齐，字体文件`my-font.ttf`，图片是一个小图标`icon.png`，修改main.js，引入文件
``` js
import _ from 'lodash';
import logText from './log.js';
import './style.css';
import './common.scss';
import Icon from './icon.png'; // 引入图片


function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = logText;
    element.appendChild(btn);

    var myIcon = new Image(); // 创建图片
    myIcon.src = Icon; // 赋值
    element.appendChild(myIcon); // 插入

    return element;
}

document.body.appendChild(component());
```
&emsp;&emsp;字体我们就放在`style.css`中引用了：
``` css
@font-face { /* 定义字体 */
    font-family: 'Myfont';
    src: url('./my-font.ttf') format('ttf');
    font-weight: 600;
    font-style: normal;
}

div {
    background-color: red;
    font-family: 'Myfont'; /*引用刚刚定义的字体*/
}
```
&emsp;&emsp;构建并在浏览器打开页面查看效果：

![效果图片](/file_loader.png 'file-loader')  

&emsp;&emsp;页面上显示有小图标，配置正确，style中有引用到字体文件,可能字体跟浏览器自带的差异不明显（或者脸盲orz）体现不出来，但真真是有效果的，因为如果没有识别成功，webpack肯定是打包失败。

### 加载其他比较偏门的资源格式
&emsp;&emsp;理论上来说`file-loader`跟`url-loader`能用来加载任何类型的文件，但我们的需求不仅仅是加载，还有可能是（按该文件的规则）分析识别其中的数据。比如csv,又比如xml，用特定的加载器，来帮助转换成我们可以直接使用的数据格式（JSON）。老规矩：  
1、安装插件
``` sh
 cnpm install csv-loader xml-loader --save-dev
```
``` sh 
√ Installed 2 packages
√ Linked 4 latest versions
√ Run 0 scripts
peerDependencies WARNING csv-loader@* requires a peer of papaparse@^4.5.0 but none was installed
```
&emsp;&emsp;安装是成功的，但是`csv-loader`说它需要一个名为`啪啪啪balabala`的高于4.5.0版本的包，然而这个包没有被安装，只是个小警告，安全起见我们给它安上。
``` sh
cnpm install --save-dev papaparse@^4.5.0
```
2. 配置
``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'file-loader',
            options: {
                name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: 'file-loader',
            options: {
                name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(csv|tsv)$/, // csv/tsv
            loader: 'csv-loader',
            options: {
                name: path.posix.join('static', 'data/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.xml$/, // xml
            loader: 'xml-loader',
            options: {
                name: path.posix.join('static', 'xml/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
            favicon: path.resolve('favicon.ico')
        })
    ]
}
```
3. 对应类型的文件  
&emsp;&emsp;没办法，xml自己写吧,文件名`data.xml`，csv的话找后台要，这里就只怼个xml（小毛驴=。=）。  
``` xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```
4. 修改main.js，引入文件
``` js
import _ from 'lodash';
import logText from './log.js';
import './style.css';
import './common.scss';
import Icon from './icon.png';
import Data from './data.xml'; // 引入刚刚写的小毛驴

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = logText;
    element.appendChild(btn);

    var myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    console.log(Data); // 打印出来look一look

    return element;
}

document.body.appendChild(component());
```
5. 可以看到xml中的内容被提取出来显示了  

![xml_loader](/xml_loader.png 'xml_loader')

