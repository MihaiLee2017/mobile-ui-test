let fs = require('fs');
let path = require('path');
let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let WebpackZipPlugin = require('zip-webpack-plugin');
let baseWebpackConfig = require('./webpack.base.conf');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
let Visualizer = require('webpack-visualizer-plugin');
let cubeModule = require('../CubeModule.json');
let env = config.build.env;

//删除文件夹
function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

//获取命令传入的参数，获取当前打得什么版本
const arguments = process.argv.slice(2);
let environment= 'test'; // 这里为修改打包cubmodule.json的环境属性，无local设置， 默认就是test
let $sourceMap = config.build.productionSourceMap;

  arguments.forEach(item => {
    if(!item.includes('map') && !item.includes('cur')){
      environment = item.replace(/-/g, '')
    }
  })
  console.error('environment', environment);


// 做版本号管理，同事更新cubemodule
  let changeVersion = true;
  let isAdd = true;
  if (arguments.includes('--cur')) {
    isAdd = false;
  }

  let version = cubeModule.version.split('.');
  if(cubeModule[`${environment}Version`]){
    version = cubeModule[`${environment}Version`].split('.');
  } else {
    version = [1, 0, 0] // 默认初始化版本号为1.0.0
  }
  
  let newVersion = [1, 0, 0] // 默认初始化版本号为1.0.0
  if(isAdd){    // 计算版本号加一   只有第一位大版本会超过10
    if(parseInt(version[2]) >= 9){
      if(parseInt(version[1]) >= 9){
        newVersion[0] = parseInt(version[0]) + 1
        newVersion[1] = 0
        newVersion[2] = 0
      } else {
        newVersion[0] = parseInt(version[0])
        newVersion[1] = parseInt(version[1]) + 1
        newVersion[2] = 0
      }
    } else {
      newVersion[0] = parseInt(version[0])
      newVersion[1] = parseInt(version[1])
      newVersion[2] = parseInt(version[2]) + 1
    }
    version = newVersion;
  }
  cubeModule.build = parseInt('' + version[0] + version[1] + version[2]) * 100;
  cubeModule.version = version.join('.');
  cubeModule[`${environment}Version`] = version.join('.');
  console.error('package version:', version.join('.'), '  package build:', cubeModule.build);
  const rootPath = __dirname.replace('\\build', '');
  deleteFolder(rootPath + '/dist');
  fs.writeFileSync(rootPath + '/CubeModule.json', JSON.stringify(cubeModule, null, 4), 'utf-8');
  

if (arguments.includes('--map')) {
  $sourceMap = true;
} else {
  $sourceMap = false;
}

console.error('sourceMap', $sourceMap);


let webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      // sourceMap: config.build.productionSourceMap,
      sourceMap: $sourceMap,
      extract: true,    // 啥意思？
      usePostCSS: true    // 啥意思？
    })
  },
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  devtool: $sourceMap ? 'cheap-module-eval-source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  resolve: {
    alias: {
      'env': path.join(__dirname, '..', './src/config/' + environment + '-env/')
    }
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: !$sourceMap,  // 打包去除debugger
        drop_console: !$sourceMap  // 打包去除console
      },
      parallel: true,  // 啥意思？
      sourceMap: $sourceMap
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: $sourceMap
      ? { safe: true, map: { inline: false } }
      : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: !$sourceMap,
        collapseWhitespace: !$sourceMap,
        removeAttributeQuotes: !$sourceMap
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../CubeModule.json'),
        to: config.build.assetsRoot
      }
    ]),
    // new EnvironmentPlugin(
    //   {
    //     from: environment,
    //     to: config.build.assetsSubDirectory
    //   }
    // ),
    new WebpackZipPlugin({
      path: path.join(__dirname, '../dist'),
      filename: (cubeModule.identifier + '-' + cubeModule.name + '-' +  cubeModule.version + '-' + environment + '.zip')
    }),
    new ProgressBarPlugin({
      clear: false
    }),
    new Visualizer({
      filename: './statistics.html'
    })
  ]
});

if (config.build.productionGzip) {
  let CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
