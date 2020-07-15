const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

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
                loader: "file-loader",
                options: {
                    publicPath: "/build"
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
        new FaviconsWebpackPlugin({
            logo: "./src/icons/android-chrome-512x512.png",
            outputPath: "/assets/",
            prefix: "build/assets/"
        }),
        new WebpackPwaManifest({
            "name": "Football App",
            "short_name": "Football",
            "gcm_sender_id": "489407451958",
            "scope": "/build/",
            "start_url": "/build/",
            "theme_color": "#1078a0",
            "background_color": "#1078a0",
            "display": "standalone",
            "orientation": "portrait",
            "icons": [{
                    "src": path.resolve('src/icons/android-chrome-192x192.png'),
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": path.resolve('src/icons/android-chrome-512x512.png'),
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
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
        new workboxPlugin.InjectManifest({
            swSrc: "./sw.js",
            swDest: 'sw.js',
        }),
    ],
}