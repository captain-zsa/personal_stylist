module.exports = {
    presets : [
        [
            '@babel/preset-env', {
                modules : false,
            },
        ],
    ],

    plugins : [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
    ],

    env : {
        test : {
            plugins : [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-modules-commonjs',
                'dynamic-import-node',
            ],
        },
    },
};
