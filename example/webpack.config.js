var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.vue$/, loader: 'vue'
      },
      {
        test: /\.js$/, loader: 'babel', exclude: /node_modules/
      },
      {
        test: /\.css$/, loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.scss$/, loader: 'style!css!sass?sourceMap'
      },
      {
        test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
        loader: "file"
      },
      {
        test: /\.(png|jpg|gif|svg|json)$/,
        loader: 'file',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    vue: {
        loaders: {
            css: 'style!css!autoprefixer',
        }
    },
  resolve: {
    alias: {vue: 'vue/dist/vue.js'}
  },
  devServer: {
      historyApiFallback: true,
      hot: false,
      inline: true,
      grogress: true,
      port: 8181,
      open: true
  },
  // devtool: '#eval-source-map'
  devtool: false
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}
