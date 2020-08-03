const webpack = require('webpack')
module.exports = {
    //基本路径
    publicPath: '/',
    // 打包的目录
    outputDir: 'dist',
    // eslint-loader在保存时校验格式
    lintOnSave: true,
    // 放置生成的静态资源(js,css,img,fonts)的(相对于outputDir的)目录
    assetsDir: 'static',
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    // 生产环境是否生成 SourceMap文件，一般情况不建议打开
    productionSourceMap: false,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
    devServer:{
        // open: true,
        // host: 'localhost',
        port: 8080,
        open:true,
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                target: 'https://192.168.1.69:2233/',
                // target: 'https://3.0.181.15/api/v1',
                /* 允许跨域 */
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
            }
        }
}
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
            })
        ]
    }
}