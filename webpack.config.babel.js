import path from 'path';

module.exports = {
  entry: {
    main: './www/js/main.js'
  },
  output: {
    path: path.join(__dirname, 'www/js'),
    publicPath: '../www/',
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  }
};