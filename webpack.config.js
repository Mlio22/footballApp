const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const copyPlugin = require('copy-webpack-plugin');
const workbox = require('workbox-webpack-plugin');

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    mode: "production",
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
        new CleanWebpackPlugin(),
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
            filename: "components/nav.html"
        }),
        new HtmlWebpackPlugin({
            template: "./components/saved.html",
            filename: "components/saved.html"
        }),
        new copyPlugin({
            patterns: [
                { from: "./manifest.json", to: "./manifest.json" },
                { from: "./src/icons/*", to: "./" },
                { from: "./src/icons/favicon.ico", to: "./favicon.ico" },
            ]
        }),
        new workbox.InjectManifest({
            swSrc: "./sw.js",
            swDest: "./sw.js"
        })
    ],
}