var PLUGIN_NAME = 'gulp-check-deps';
var util = require('gulp-util');
var path = require('path');
var checkDepsInitial = require('check-deps');
var logger = {
  log: util.log,
  error: function(log) {
    return new util.PluginError(PLUGIN_NAME, log);
  }
};
var checkDeps = function(config) {
  return checkDepsInitial(config, logger);
};
var checkDepsTask = function(gulp) {
    gulp.task('deps:check', function() {
        return gulp.src(path.join(process.cwd(), 'package.json'))
            .pipe(checkDeps());
    });
};

module.exports = checkDeps;
module.exports.task = checkDepsTask;
module.exports.levels = checkDepsInitial.levels;
module.exports.defaults = checkDepsInitial.defaults;
