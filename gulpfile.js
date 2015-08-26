var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    jshint = require('gulp-jshint'),
    changelog = require('conventional-changelog'),
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

gulp.task('release:changelog', function() {
    return changelog(
        { preset: 'angular' },
        {
            repository: 'https://github.com/pmsipilot/gulp-check-deps',
            version: require(path.join(directories.main, 'package.json')).version
        }
    ).pipe(fs.createWriteStream(path.join(directories.main, 'CHANGELOG.md')));
});

gulp.task('default', ['check:cs', 'check:deps']);
gulp.task('release', ['check:cs', 'check:deps', 'release:changelog']);
