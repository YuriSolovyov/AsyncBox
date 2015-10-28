var webpack = require("webpack");

webpack({
    entry: './lib/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'async-box.min.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                dead_code: false,
                side_effects: false
            }
        })
    ]
}, function(err, stats) {
    if (!err) {
        console.log(stats.toString());
    } else {
        console.log(err);
    }
});
