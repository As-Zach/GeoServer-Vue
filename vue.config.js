const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'
module.exports = {
    // 基本路径 baseURL已经过时
    publicPath: './',  
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    runtimeCompiler: true,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: () => {},
    configureWebpack: {
      plugins: [
        new CopyWebpackPlugin([{ from: 'public/', to: 'public' }]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
        ]),
        new CopyWebpackPlugin([
          {
            from: path.join(cesiumSource, 'ThirdParty/Workers'),
            to: 'ThirdParty/Workers'
          }
        ]),
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify('./')
        })
      ],
      resolve: {
          alias: {
              'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
          }
      }
  },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
     // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
     // 开启 CSS source maps?
    sourceMap: false,
     // css预设器配置项
    loaderOptions: {},
     // 启用 CSS modules for all css / pre-processor files.
    modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
      open: false,// 配置自动启动浏览器
      disableHostCheck: true,
      host: "0.0.0.0", // 允许外部ip访问
      port: 8095,
      https: false,
      hotOnly: false,
      proxy: {
        '/api': {
            //只要输入/api(该路径可自定义)会自动重定向(替换)为target中的地址(服务器地址)
            target: 'http://localhost:8080',
            //changeOrigin：true 允许跨域
            changeOrigin: true,
            //路径重写，/api是自定义路径，真正项目中是没有这个路径的，所以要去掉
            pathRewrite: {
                '^/api': ''
            }
        }
      },

    before: app => {}
    },
    // 第三方插件配置
    pluginOptions: {
     // ...
    }
  }
  