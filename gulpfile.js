var gulp = require("gulp"),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream');

    var config = require('./webpack.config.js');

gulp.task('default', function() {
  return gulp.src('src/app.js')
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest('dist/js/'));
});
