var gulp = require('gulp'),
    path = require('path'),
    jshint = require('gulp-jshint'),
    checkDeps = require('./'),
    directories = {
        main: __dirname
    },
    files = {
        js: './*.js'
    };

gulp.task('check:cs', function() {
    return gulp.src(files.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('check:deps', function() {
    var checkDepsConfig = {
        failForGitDependencies: true
    };

    return gulp.src(path.join(directories.main, 'package.json'))
        .pipe(checkDeps(checkDepsConfig));
});

gulp.task('default', ['check:cs', 'check:deps']);
