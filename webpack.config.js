const path = require('path');


let temp = {
  mode: 'development',
  // context: path.join(__dirname,),
  entry: path.join(__dirname, 'src', 'background.js'),
  watch: true,
  
  output: {
    path: path.join(__dirname, 'src', 'dist'),
    publicPath: '/dist/',   //需要异步加载的资源
    filename: "background.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /.jsx$/,  //正则匹配，根据不同的文件
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',       //不止可以通过loader直接配置，还可以在源码的require里面使用类似于这样的方式进行引入： require('style-loader!css-loader?minimize!./main.css');
        query: {
          presets: [
            ["@babel/env", {
              "targets": {
                "browsers": "last 2 chrome versions"
              }
            }]
          ]
        }
      },
    ]
  },
  // plugins 的作用是增强webpack的功能，通过在构建流程当中注入钩子实现
  // plugins: [
  //   new ExtractTextPlugin({
  //     // 从 .js 文件中提取出来的 .css 文件的名称
  //     filename: `[name]_[contenthash:8].css`,
  //   }),
  // ],
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
  }
};
console.log(temp);
module.exports = temp;