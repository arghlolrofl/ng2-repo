module.exports = {
    entry: "./src/main",
    output: {
        path: __dirname,
        filename: "./app/bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: {
            index: 'index.html'
        }
    }
};