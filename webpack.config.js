const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    mode: "production",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: "/node_modules/",
            use: [{
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        }),
        // new HtmlWebpackPlugin({
        //     template: "./components/nav.html",
        //     filename: "./components/nav.html"
        // }),
        // new HtmlWebpackPlugin({
        //     template: "./components/competition-item.html",
        //     filename: "./components/competition-item.html"
        // }),
        // new HtmlWebpackPlugin({
        //     template: "./components/competitionsAndSaved.html",
        //     filename: "./components/competitionsAndSaved.html"
        // }),
        // new HtmlWebpackPlugin({
        //     template: "./components/home.html",
        //     filename: "./components/home.html"
        // }),
        // new HtmlWebpackPlugin({
        //     template: "./components/saved.html",
        //     filename: "./components/saved.html"
        // }),


    ]
}