const webpack = require('webpack')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isPro = process.env.NODE_ENV === "production";

function resolve(dir) {
    return path.join(__dirname, dir)
    window.console.log('env', isPro)
}

const pagesObject = {
    login: {
        // page 的入口
        entry: 'src/pages/system/main.js',
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: 'login.html',
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        // title:'index',
        // 提取出来的通用 chunk 和 vendor chunk。
        chunks: ["chunk-vendors", "chunk-common", "login"]
    },
    index: {
        // page 的入口
        entry: 'src/pages/home/main.js',
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: 'index.html',
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        // title:'index',
        // 提取出来的通用 chunk 和 vendor chunk。
        chunks: ["index"]
    },

};


module.exports = {
    //基本路径
    publicPath: './',
    // 打包的目录
    outputDir: 'web',
    // eslint-loader在保存时校验格式
    lintOnSave: false,
    // 放置生成的静态资源(js,css,img,fonts)的(相对于outputDir的)目录
    assetsDir: 'static',
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    // 生产环境是否生成 SourceMap文件，一般情况不建议打开
    productionSourceMap: false,
    pages: pagesObject,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@i': path.resolve(__dirname, './src/assets'),
            }
        },
        plugins: [
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locales$/, /moment$/),
            //配置compression-webpack-plugin压缩
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 20,
                minChunkSize: 10000
            }),
            //打包体积分析
            new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: isPro ? true : false,
                statsOptions: { source: false }
            })
        ]
    },
    devServer: {
        // open: true,
        // host: 'localhost',
        port: 8080,
        open: true,
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
    // configureWebpack: config => {
    //     if(isPro) {
    //         config.externals = {
    //             "vue": "Vue",
    //             "vue-router": "VueRouter",
    //             "vuex": "Vuex",
    //             "axios": "axios"
    //         }
    //     }
    // },

    chainWebpack: config => {
        Object.keys(pagesObject).forEach(page => {
            config.plugins.delete(`preload-${page}`)
            config.plugins.delete(`prefetch-${page}`)
        })
        //分包
        config
            .optimization.splitChunks({
                chunks: 'async',
                cacheGroups: {
                    // libs: {
                    //     name: 'chunk-libs',
                    //     test: /[\\/]node_modules[\\/]/,
                    //     priority: 10,
                    //     chunks: 'initial' // only package third parties that are initially dependent
                    // },
                    echarts: {
                        name: 'chunk-echarts', // split echarts into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?echarts(.*)/ // in order to adapt to cnpm
                    },
                    iview: {
                        name: 'chunk-iview',
                        priority: 20,
                        test: /[\\/]node_modules[\\/]_?iview(.*)/
                    },
                    design: {
                        name: 'chunk-design',
                        priority: 20,
                        test: /[\\/]node_modules[\\/]_?view-design(.*)/
                    },
                    // material: {
                    //     name: 'chunk-material',
                    //     priority: 20,
                    //     test: /[\\/]node_modules[\\/]_?vue-material(.*)/ // in order to adapt to cnpm
                    // },
                    // commons: {
                    //     name: 'chunk-commons',
                    //     test: resolve('src/view/components'), // can customize your rules
                    //     minChunks: 3, //  minimum common number
                    //     priority: 5,
                    //     reuseExistingChunk: true
                    // }
                }
            })
    },
}