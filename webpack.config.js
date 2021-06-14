const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const portFinderSync = require('portfinder-sync');

const portInt = 3000;
const aggregateTimeout = 300;

const __paths = require('./paths.config');
const isDevelopment = process.env.NODE_ENV === 'development';
const isStats = process.env.STATS === 'stats';
const isProduction = isStats ? isStats : !isDevelopment;
const isExpress = isDevelopment && process.env.TPL === 'express';
const isTwigLoader = !isExpress && (!isProduction || process.env.TPL !== 'none');
const distPath = path.join(__dirname, __paths.root);
const port = portFinderSync.getPort(portInt);

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const SvgSpritePlugin = require('svg-sprite-loader/plugin');

let HtmlWebpackPlugin;

let ScriptExtHtmlWebpackPlugin;

if (isTwigLoader) {
    HtmlWebpackPlugin = require('html-webpack-plugin');
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
}

let BundleAnalyzerPlugin;

if (isStats) {
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
}

const params = {
    rootDir       : __dirname,
    pathsConfig   : __paths,
    isDevelopment : isDevelopment,
    isStats       : isStats,
    isProduction  : isProduction,
    isExpress     : isExpress,
    isTwigLoader  : isTwigLoader,
    distPath      : distPath,
    port          : port,
};

console.log({
    isDevelopment : isDevelopment,
    isStats       : isStats,
    isProduction  : isProduction,
    isExpress     : isExpress,
    isTwigLoader  : isTwigLoader,
});

const config = {
    mode  : isStats || isProduction ? 'production' : 'development',
    entry : () => {
        let entries = {
            index : [],
        };

        // Подключаем twig страницы
        // Для перезагрузки браузера при изменении страницы и компонентов внутри него
        if (isTwigLoader && isDevelopment) {
            const pages = glob
                .sync('*.twig', {
                    matchBase : true,
                    cwd       : path.join(__dirname, './src/pages/'),
                })
                .map(twigFile => path.join(__dirname, './src/pages/', twigFile));

            entries.index.push(...pages);
        }

        // Подключаем корневые скрипты /js
        entries.index.push(...glob.sync(__paths.js.main));

        // Подключаем корневые стили /styles
        entries.index.push(...glob.sync(__paths.css.main));

        // Подключаем стили компонентов
        entries.index.push(...glob.sync(__paths.css.components.src));

        // Подключаем скрипты компонентов
        entries.index.push(...glob.sync(__paths.js.components.src));

        // Подключение svg spite
        entries.index.push(...glob.sync(__paths.svg.src));

        return entries;
    },

    output : {
        filename      : 'js/[name].js',
        chunkFilename : 'js/[name].chunk.js',
        path          : distPath,
    },

    watch : isDevelopment,

    watchOptions : {
        aggregateTimeout : aggregateTimeout,
    },

    devtool : isProduction ? false : 'eval-source-map',

    module : {
        rules : [
            {
                test    : /\.js$/,
                exclude : /(node_modules\/(?!(swiper|dom7)\/).*|bower_components)/,
                use     : [
                    {
                        loader  : 'babel-loader',
                        options : {
                            presets : ['@babel/preset-env'],
                            plugins : [
                                require('@babel/plugin-proposal-object-rest-spread'),
                                require('@babel/plugin-transform-object-assign'),
                            ],
                        },
                    },
                ],
            },
            {
                test    : /\.s[ac]ss$/,
                exclude : /node_modules/,
                use     : [
                    {
                        loader  : MiniCssExtractPlugin.loader,
                        options : {
                            hmr : isDevelopment,
                        },
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            sourceMap : true,
                        },
                    },
                    {
                        loader  : 'postcss-loader',
                        options : {
                            config : {
                                path : path.join(__dirname, '/'),
                            },
                        },
                    },
                    {
                        loader  : 'sass-loader',
                        options : {
                            sourceMap : true,
                        },
                    },
                    {
                        loader  : 'sass-resources-loader',
                        options : {
                            resources : ['./src/styles/ds-system/ds-main.scss'],
                        },
                    },
                ],
            },
            {
                test    : /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                exclude : [
                    path.join(__dirname, './src/img/sprites'),
                ],
                use : [
                    {
                        loader  : 'file-loader',
                        options : {
                            name       : '[path][name].[ext]',
                            context    : 'src/',
                            publicPath : '../',
                        },
                    },
                ],
            },
            {
                test    : /\.svg$/,
                include : [
                    path.join(__dirname, './src/img/sprites'),
                ],
                loader  : 'svg-sprite-loader',
                options : {
                    symbolId       : filePath => `icon-${path.parse(filePath).name}`,
                    spriteFilename : __paths.svg.name,
                    extract        : true,
                },
            },
            isTwigLoader ? {
                test : /\.twig$/,
                use  : [
                    'raw-loader',
                    {
                        loader  : 'twig-html-loader',
                        options : {
                            data       : require('./tasks/readData')(isDevelopment, __dirname),
                            filters    : require('./tasks/filters'),
                            functions  : require('./tasks/functions'),
                            extend     : require('./tasks/extends'),
                            namespaces : {
                                organisms : './src/include/&organisms',
                                molecules : './src/include/^molecules',
                                atoms     : './src/include/@atoms',
                                layouts   : './src/include/layouts',
                                mixins    : './src/include/+mixins',
                            },
                        },
                    },
                ],
            } : {},
            {
                test    : /\.vue$/,
                loader  : 'vue-loader',
                options : {},
            },
        ],
    },

    plugins : [
        new MiniCssExtractPlugin({
            filename      : 'css/[name].css',
            chunkFilename : 'css/[name].chunk.css',
        }),

        // Создания страниц
        ...isTwigLoader ? glob.sync('*.twig', {
            matchBase : true,
            cwd       : path.join(__dirname, './src/pages/'),
        }).map(twigFile => {
            const twigFileObj = path.parse(twigFile);


            return new HtmlWebpackPlugin({
                filename : path.join(twigFileObj.dir, twigFileObj.name + '.html'),
                template : path.join(__dirname, './src/pages', twigFile),
                minify   : false,

                // Несовместимо с серверным рендерингом страниц
                inject : false,
            });
        }) : [],

        // Добавляем к подключаемым скриптам defer
        ...isTwigLoader ? [new ScriptExtHtmlWebpackPlugin({ defaultAttribute: 'defer' })] : [],

        // Удаляем папку dist
        new CleanWebpackPlugin(),

        // Перемещение файлов
        new CopyPlugin([
            {

                // Перемещам содержимое static в dist
                from   : 'src/static/',
                toType : 'dir',
            },
            {

                // Перемещаем содержимое img в dist/img
                from : 'src/img/',
                to   : 'img',
            },
            {

                // Перемещаем содержимое api в dist/api
                from : 'api',
                to   : 'api',
            },
        ]),

        // Анализ bundls
        ...isStats ? [new BundleAnalyzerPlugin()] : [],

        new webpack.ProvidePlugin({
            $ : 'jquery',
        }),

        new VueLoaderPlugin(),

        new SvgSpritePlugin({ plainSprite: true }),
    ],

    optimization : {
        minimize    : isProduction,
        minimizer   : isProduction ? [new TerserPlugin(), new OptimizeCssAssetsPlugin()] : [],
        splitChunks : {
            chunks : 'all',
        },
    },

    stats : {
        all         : false,
        modules     : false,
        errors      : true,
        entrypoints : false,
        children    : false,
    },

    devServer : {
        historyApiFallback : true,
        host               : '0.0.0.0',
        port               : port,

        // Открыть браузер после запуска
        open   : false,
        hot    : true,
        inline : true,

        // Вывод ошибок и предупреждений сборки в HTML
        overlay : {
            warnings : true,
            errors   : true,
        },
        public : `localhost:${port}`,

        ...isExpress ? { before: require('./tasks/twigServer')(params) } : {},
    },

    resolve : {
        alias : {
            'vue' : 'vue/dist/vue.esm.js',
            '&'   : path.resolve(__dirname, './src/include/&organisms/'),
            '^'   : path.resolve(__dirname, './src/include/^molecules/'),
            '@'   : path.resolve(__dirname, './src/include/@atoms/'),
            '~'   : path.resolve(__dirname, './src/'),
        },
    },
};

module.exports = config;
