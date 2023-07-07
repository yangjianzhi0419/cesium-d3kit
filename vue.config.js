const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack")
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const cesiumSource = 'node_modules/cesium/Build/Cesium'

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new NodePolyfillPlugin(),
            // new webpack.DefinePlugin({
            //     CESIUM_BASE_URL: JSON.stringify('static')
            // }),
            // new CopyWebpackPlugin({patterns: [{from: path.join(cesiumSource, 'Workers'), to: 'static/Workers'}]}),
            // new CopyWebpackPlugin({patterns: [{from: path.join(cesiumSource, 'Assets'), to: 'static/Assets'}]}),
            // new CopyWebpackPlugin({patterns: [{from: path.join(cesiumSource, 'ThirdParty'), to: 'static/ThirdParty'}]}),
            // new CopyWebpackPlugin({patterns: [{from: path.join(cesiumSource, 'Widgets'), to: 'static/Widgets'}]})
        ]
    }
})
