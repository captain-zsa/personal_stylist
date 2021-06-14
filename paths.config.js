module.exports = {
    root : './dist',
    html : {
        srcExt : 'twig',
        base   : './src',
        main   : './src/pages/**/*.twig',
        src    : [
            './data/*.json',
            './src/pages/**/*.twig',
            './src/include/**/*.twig',
            './src/include/**/*.svg',
            './src/include/**/*.json',
        ],
        components : {
            pattern : './src/include/%s/%s.twig',
            replace : [
                [/^@/, '@atoms/'],
                [/^\^/, '^molecules/'],
                [/^&/, '&organisms/'],
            ],
        },
        svg : {
            pattern : './src/img/%s.svg',
        },
        data : './data',
        dest : './dist',
    },
    css : {
        srcExt : 'scss',
        main   : './src/styles/[a-z]*.s[ac]ss',
        src    : [
            './src/styles/**/*.s[ac]ss',
        ],
        components : {
            src               : './src/include/**/*.s[ac]ss',
            base              : './src',
            entryRelativePath : '../',
        },
        dest : 'css',
    },
    js : {
        srcExt : 'js',
        main   : './src/js/*.js',
        src    : [
            './src/js/**/*.js',
            './src/include/**/*.js',
        ],
        components : {
            src : './src/include/**/*.js',
        },
        dest            : './dist',
        webpackDestRoot : './dist',
    },
    svg : {
        src  : './src/img/sprites/*.svg',
        name : 'sprite.svg',
    },
    copy : {
        img    : ['src/img/**/*.*', 'dist/img/'],
        fonts  : ['src/fonts/**/*.*', 'dist/fonts/'],
        static : ['src/static/**/*.*', 'dist/'],
    },
};
