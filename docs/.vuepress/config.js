module.exports = {
    title: '开发文档',
    description: '个人向，非主流',
    base: '/',
    themeConfig: {
        nav: [{
            text: '规范',
            link: '/guide/'
        }, {
            text: '配置',
            link: '/setting/'
        }, {
            text: '探究',
            link: '/exploration/'
        }, {
            text: '发展',
            link: '/development/'
        }],
        sidebar: {
            '/guide/': [
                ['', '前言'],
                ['one', '项目结构介绍']
            ],
            '/setting/': [{
                title: 'webpack4',
                collapsable: false,
                children: [
                    ['', '配置目标'],
                    ['webpack-new-built', '新建一个项目'],
                    ['webpack-division', '开发与生产环境区分'],
                    ['webpack-common', '通用配置'],
                    ['webpack-dev', '开发配置'],
                    ['webpack-prod', '生产配置']
                ]
            }],
            '/exploration/': [
                ['', '开始']
            ],
            '/development': [
                ['', '起步']
            ]
        }
    }
}