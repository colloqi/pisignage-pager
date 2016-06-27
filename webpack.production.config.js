const path = require('path');
const webpack = require('webpack');

const swPrecache = require('sw-precache');
const packageJson = require('./package.json');

function WebpackSwPrecachePlugin(options) {
}

WebpackSwPrecachePlugin.prototype.apply = function(compiler) {
    var rootDir = 'static';

    var defaultOptions = {
        cacheId: packageJson.name,
        //directoryIndex: "index.html",
        // dynamicUrlToDependencies: {
        //     '/app/efle3r': [
        //         path.join(rootDir, 'views', 'index.html')
        //     ]
        // },
        // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
        // the service worker will precache resources but won't actually serve them.
        // This allows you to test precaching behavior without worry about the cache preventing your
        // local changes from being picked up during the development cycle.
        handleFetch: true,
        importScripts: ['sw-toolbox-config.js'],
        //logger: function,
        maximumFileSizeToCacheInBytes: 10485760,  //10MB
        //navigateFallback: "index.html",
        //navigateFallbackWhitelist: [/^\/guide\//],
        // runtimeCaching: [{
        //     // See https://github.com/GoogleChrome/sw-toolbox#methods
        //     urlPattern: /runtime-caching/,
        //     handler: 'cacheFirst',
        //     // See https://github.com/GoogleChrome/sw-toolbox#options
        //     options: {
        //         cache: {
        //             maxEntries: 1,
        //             name: 'runtime-cache'
        //         }
        //     }
        // }],
        replacePrefix: "/app/pager",
        staticFileGlobs: [
            //rootDir + '/**/*.{js,json,css,png,jpg,gif,svg,eot,ttf,woff}'
            rootDir + '/css/**/*.css',
            rootDir + '/index.html',
            rootDir + '/images/**/*',
            rootDir + '/js/bundle.js',
            rootDir + '/js/localforage.min.js',
            rootDir + '/js/register-service-worker.js',
            rootDir + '/js/sw-toolbox.js',
            rootDir + '/*.json'
        ],
        stripPrefix: rootDir,
        verbose: true
    }
    compiler.plugin("after-emit", (compilation, callback) => {
        swPrecache.write(path.join(rootDir,"sw-precache-config.js"), defaultOptions, function(err){
            if (err) {
                console.log("\n*** sw-precache file creation error: "+err)
            } else {
                console.log("\nCreated sw-precache file static/sw-precache-config.js")
            }
            callback(err);
        })
    });
};


module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + "/static/js",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.css$/,
                loader: 'style!css?modules!postcss'
            }
        ],
        resolve: {
            modulesDirectories: ['node_modules'],
            alias: {},
            extensions: ['', '.js', '.jsx']
        }
    },
    postcss: [
        require('autoprefixer')
    ],

    plugins: [

        new webpack.BannerPlugin("Copyright Colloqi Consulting(OPC) Pvt Ltd."),
        /**
         * NoErrorsPlugin prevents your webpack CLI from exiting with an error code if
         * there are errors during compiling - essentially, assets that include errors
         * will not be emitted. If you want your webpack to 'fail', you need to check out
         * the bail option.
         */
        new webpack.NoErrorsPlugin(),
        /**
         * DefinePlugin allows us to define free variables, in any webpack build, you can
         * use it to create separate builds with debug logging or adding global constants!
         * Here, we use it to specify a development build.
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new WebpackSwPrecachePlugin()

    ]
};