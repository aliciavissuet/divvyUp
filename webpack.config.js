

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
});
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'main.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                use: ['css-loader'],
            },
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
};