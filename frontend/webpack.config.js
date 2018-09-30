const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/js/main.js',
    mode: 'development',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../xnotesapp/static')
    },
    devServer: {
        contentBase: '../xnotesapp/static',
        watchContentBase: 'true'
    },
    resolve: {
        alias: {
            //$: "jquery/src/jquery",
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, "./src/app")],
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    plugins: [
        //new HtmlWebpackPlugin({template: './index.html'})
     ]
};