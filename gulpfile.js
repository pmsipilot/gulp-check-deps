var gulp = require('gulp'),
    path = require('path'),
    through2 = require('through2'),
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
        failForGitDependencies: true,
        ignore: 'conventional-changelog'
    };

    return gulp.src(path.join(directories.main, 'package.json'))
        .pipe(checkDeps(checkDepsConfig));
});

gulp.task('release:changelog', function(done) {
    changelog({
        repository: 'https://github.com/pmsipilot/gulp-check-deps',
        version: require(__dirname + '/package.json').version
    }, function(err, log) {
        if (!err) {
            fs.writeFileSync(__dirname + '/CHANGELOG.md', log);
        }

        done(err);
    });
});

gulp.task('default', ['check:cs', 'check:deps']);
gulp.task('release', ['check:cs', 'check:deps', 'release:changelog']);
