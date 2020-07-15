const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const manifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
        publicPath: "/assets/"
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
                loader: "file-loader",
                options: {
                    outputPath: "/icons/[name].[hash].[ext]"
                }
            },
            {
                test: /\.css/,
                use: [
                    "style-loader", "css-loader"
                ]
            },
            // {
            //     test: /\.json/,
            //     loader: "json-loader"
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
        new manifestPlugin(),
        new FaviconsWebpackPlugin("./src/icons/android-chrome-512x512.png"),
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
        new workboxPlugin.GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
        }),
    ],
}