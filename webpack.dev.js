const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const workbox = require('workbox-webpack-plugin');

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "/"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [{
                test: /\.html/,
                use: [{
                    loader: "html-loader",
                    options: {
                        attributes: true
                    }
                }]
            },
            {
                test: /\.(ico|png|jpe?g|gif|svg)$/i,
                loader: "file-loader?name=[name].[ext]",
                options: {
                    publicPath: "./assets/"
                }
            },
            {
                test: /\.css/,
                use: [
                    "style-loader", "css-loader"
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            template: "./components/competition-item.html",
            filename: "components/competition-item.html"
        }),
        new HtmlWebpackPlugin({
            template: "./components/competitionsAndSaved.html",
            filename: "components/competitionsAndSaved.html"
        }),
        new HtmlWebpackPlugin({
            template: "./components/home.html",
            filename: "components/home.html"
        }),
        new HtmlWebpackPlugin({
            template: "./components/nav.html",
            filename: "components/nav.html",
            hash: false
        }),
        new HtmlWebpackPlugin({
            template: "./components/saved.html",
            filename: "components/saved.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./manifest.json", to: "./manifest.json" },
                { from: "./src/icons/*", to: "./src/icons/" },
                { from: "./src/icons/favicon.ico", to: "./favicon.ico" },
            ]
        }),
        new workbox.InjectManifest({
            swSrc: "./sw.js",
            swDest: "./sw.js"
        })
    ],
}