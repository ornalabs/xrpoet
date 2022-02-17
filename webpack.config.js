const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const process = require('process')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let config = {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 9000
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html\.(slm|slim)$/,
        use: [
          {loader: 'html-loader'},
          {loader: path.resolve('./slm-loader.js'), options: {useCache: false, cache: false} }
        ]
      },
      { test: /\.html\.(pug)$/, loader: 'pug-loader' },
      { test: /\.(md)$/, loader: 'html-loader!markdown-loader' },
      { test: /\.(frag|vert|glsl)$/, loader: 'glsl-shader-loader'},
      { test: /\.(styl)$/, loader: 'style-loader!css-loader!stylus-loader'},
      {test: /\.(png|jpe?g|gif|obj|mtl|glb|wav|hdr)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              esModule: false,
              fallback: require.resolve('file-loader'),
              name: 'asset/[contenthash].[ext]',
            },
          },
        ]
      },
    ]
  }
};

let app = Object.assign({
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html.slm',
      filename: 'index.html'
    }),
  ],
}, config);

module.exports = [app]
