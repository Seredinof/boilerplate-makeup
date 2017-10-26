let gulp = require('gulp'),
    path = require('path'),
    fs = require("fs"),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    svgSprite = require('gulp-svg-sprite'),
    makeDecl = require('./makeDecl'),
    bemconfig = require('./bem.config'),
    csso = require('gulp-csso'),
    cssbeautify = require('gulp-cssbeautify'),
    babel = require('gulp-babel'),
    webpack = require('webpack-stream'),
    util = require('gulp-util');

let levels = bemconfig.levels,
    bundlesName = bemconfig.bundlesName;

var production = !!util.env.production;

gulp.task('default', ['build', 'server']);

gulp.task('build', ['css', 'js', 'images', 'svg-sprite']);

gulp.task('css', function(){
    makeDecl.then(function (blocksDir) {
        gulp.src(blocksDir.map(function (p) {
            return p + '*.scss';
        }))
            .pipe(concat('styles.scss'))
            .pipe(sass().on('error', sass.logError))
            .pipe(csso())
            .pipe(!production ? cssbeautify() : util.noop())
            .pipe(postcss([autoprefixer]))
            .pipe(gulp.dest(bundlesName + '/css'))
            .pipe(reload({stream:true}));

   })
});

gulp.task('js', function(){
    makeDecl.then(function (blocksDir) {
        gulp.src(blocksDir.map(function (p) {
            return p + '*.js';
        }))
        .pipe(webpack(require('./webpack.config')))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(bundlesName +'/js'))
        .pipe(reload({stream:true}));

    })
});

gulp.task('images', function(){
    makeDecl.then(function (blocksDir) {
        gulp.src(blocksDir.map(function(dir){
            let imgGlob=dir + '/*.{jpg,png,svg,gif}';
            return imgGlob;
        }))
            .pipe(gulp.dest(bundlesName + '/images'))
            .pipe(reload({stream:true}));
    });
});

gulp.task('svg-sprite', function(){
    // More complex configuration example
    let config = {
        mode: {
            symbol: true      // Activate the «symbol» mode
        }
    };
    gulp.src('**/*.svg', {cwd: 'default.blocks/svg-icons'})
        .pipe(svgSprite(config))
        .pipe(gulp.dest(bundlesName + '/images'));
});

gulp.task('server', function(){
    browserSync.init({
        server: './' + bundlesName ,
        index: 'main.html'
    });
    gulp.watch(levels.map(function(level){
        let cssGlob = level + '/**/*.scss';
        return cssGlob;
    }), ['css']);

    gulp.watch(levels.map(function(level){
        let cssGlob = level + '/**/*.js';
        return cssGlob;
    }), ['js']);

    gulp.watch(levels.map(function(level){
        let cssGlob = level + '/**/*.{jpg,png,svg,gif}';
        return cssGlob;
    }), ['images', 'svg-sprite']);

    gulp.watch(bundlesName + '/*.html', ['css', 'js', 'images', 'svg-sprite']);
    gulp.watch(bundlesName + '/*.html').on('change',  reload);
});