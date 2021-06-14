const isProd = process.env.NODE_ENV !== 'development';

const presetEnv = require('postcss-preset-env')({
    autoprefixer : {
        cascade : true,
        grid    : true,
        flexbox : true,
    },
    minimize : isProd,
});

module.exports = ({ file, options, env }) => {
    let plugins = [];

    plugins.push(presetEnv);

    return {
        plugins   : plugins,
        sourceMap : true,
    };
};
