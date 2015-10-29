var webpack = require("webpack");
var Promise = require("bluebird");

var configs = [{
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
}];

Promise.map(configs, function(config) {
    return new Promise(function(resolve, reject) {
        webpack(config, function(err, stats) {
            if (!err) {
                resolve(stats);
            } else {
                reject(err);
            }
        });

    });
}).all().then(function(results) {
    results.forEach(function(result) {
        console.log(results.toString());
    });
});
