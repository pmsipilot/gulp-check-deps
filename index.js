var PLUGIN_NAME = 'gulp-check-deps';

var through = require('through2'),
    util = require('gulp-util'),
    semver = require('semver'),
    Table = require('cli-table'),
    assign = require('object-assign'),
    spawn = require('child_process').spawn,
    path = require('path');

require('colors');

var levels = {
        none: 3,
        major: 2,
        minor: 1,
        patch: 0
    },
    defaults = {
        npmPath: 'npm',
        npmArgs: [],
        failForDevDependencies: true,
        failForGitDependencies: false,
        failLevel: levels.minor,
        ignore: []
    },
    checkDeps = function(config) {
        config = assign({}, defaults, config);

        var stream = through.obj(function(file, enc, cb) {
            var npmWorkingDirectory = path.dirname(file.path),
                packageJson = JSON.parse(file.contents.toString()),
                outdated = spawn(config.npmPath, ['outdated', '--json', '--long'].concat(config.npmArgs), { cwd: npmWorkingDirectory }),
                outdatedData = '';

            outdated.stdout.on('data', function(chunk) { outdatedData += chunk.toString(); });
            outdated.stdout.on('end', function() {
                var json;

                try {
                    json = JSON.parse(outdatedData);
                } catch (e) {
                    json = {};
                }

                var deps = [],
                    notices = {},
                    errors = [],
                    gitStr = 'git'.green,
                    majorStr = 'major'.green.bold,
                    minorStr = 'minor'.green.bold,
                    patchStr = 'patch'.green.bold,
                    addError = function(depName) {
                        if ((json[depName].type !== 'devDependencies' || config.failForDevDependencies === true) && config.ignore.indexOf(depName) === -1) {
                            errors.push(depName);
                        }
                    };

                Object.keys(json).forEach(function(depName) {
                    var dep = json[depName];

                    dep.name = depName;
                    deps.push(dep);
                });

                deps
                    .sort(function(a, b) {
                        if (a.type === b.type) {
                            if (a.name < b.name) {
                                return -1;
                            }

                            if (a.name > b.name) {
                                return 1;
                            }

                            return 0;
                        }

                        if (a.type === 'dependencies' && b.type !== 'dependencies') {
                            return -1;
                        }

                        return 1;
                    })
                    .forEach(function(dep) {
                        if (!notices[dep.name]) {
                            notices[dep.name] = [];
                        }

                        if (dep.wanted === 'git') {
                            notices[dep.name].push('Cannot find latest release info: required through ' + gitStr);

                            if (config.failForGitDependencies === true) {
                                addError(dep.name);
                            }
                        } else {
                            var wanted = {
                                    major: semver.major(dep.wanted),
                                    minor: semver.minor(dep.wanted),
                                    patch: semver.patch(dep.wanted)
                                },
                                latest = {
                                    major: semver.major(dep.latest),
                                    minor: semver.minor(dep.latest),
                                    patch: semver.patch(dep.latest)
                                };

                            if (wanted.major < latest.major) {
                                notices[dep.name].push('New ' + majorStr + ' release available: ' + dep.latest.green.bold);

                                if (config.failLevel >= levels.major) {
                                    addError(dep.name);
                                }
                            }

                            if (wanted.major === latest.major && wanted.minor < latest.minor) {
                                notices[dep.name].push('New ' + minorStr + ' release available: ' + dep.latest.green.bold);

                                if (config.failLevel >= levels.minor) {
                                    addError(dep.name);
                                }
                            }

                            if (wanted.major === latest.major && wanted.minor === latest.minor && wanted.patch < latest.patch) {
                                notices[dep.name].push('New ' + patchStr + ' release available: ' + dep.latest.green.bold);

                                if (config.failLevel >= levels.patch) {
                                    addError(dep.name);
                                }
                            }
                        }
                    });

                if (Object.keys(notices).length > 0) {
                    var table = new Table({
                        chars: {
                            mid: '',
                            'left-mid': '',
                            'mid-mid': '',
                            'right-mid': ''
                        },
                        head: ['Dependency', 'Type', 'Constraint', 'Current', 'Notices']
                    });

                    Object.keys(notices)
                        .filter(function(depName) {
                            return !!notices[depName].length;
                        })
                        .forEach(function(depName) {
                            var constraint = packageJson[json[depName].type][depName],
                                matches;

                            if ((matches = constraint.match(/#(.*)$/)) !== null) {
                                constraint = matches[1];

                                if (constraint.match(/[0-9a-f]{40}/) !== null) {
                                    constraint = constraint.substr(0, 9);
                                }
                            }

                            table.push([
                                depName,
                                json[depName].type === 'dependencies' ? 'Dependency' : 'Dev. dependency',
                                constraint,
                                json[depName].current || 'N/A',
                                notices[depName].join('\n')
                            ]);
                        });

                    table.toString().split('\n').forEach(function (row) {
                        util.log(row);
                    });
                }

                cb(errors.length > 0 ? new util.PluginError(PLUGIN_NAME, 'Some of your dependencies are outdated: ' + errors.join(', ')) : null);
            });

            this.push(file);
        });

        return stream;
    },
    checkDepsTask = function(gulp) {
        gulp.task('deps:check', function() {
            return gulp.src(path.join(process.cwd(), 'package.json'))
                .pipe(checkDeps());
        });
    };

module.exports = checkDeps;
module.exports.task = checkDepsTask;
module.exports.levels = levels;
module.exports.defaults = defaults;
