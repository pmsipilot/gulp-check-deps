# gulp-check-deps [![Build Status](https://travis-ci.org/pmsipilot/gulp-check-deps.svg?branch=master)](https://travis-ci.org/pmsipilot/gulp-check-deps)

[Gulp](http://gulpjs.com/) plugin to check your dependencies (through npm outdated)

![gulp-check-deps](demo.gif)

## Why ?

NPM and its `outdated` command are good tools to gather informations about the state of a project's dependencies. The problem with
it is that it never fails. Even when there are outdated dependencies, the command exits with a `0` status.

Moreover, you cannot configure it to warn only if some criteria are satisifed, for example if you want to consider a dependency outdated
only when there is a new minor or patch release.

This plugin adresses those two issues:

* It fails when there is something outdated
* It lets you configure when you want it to fail

It is really CI friendly !

## How to use ?

```js
//gulpfile.js

var checkDeps = require('gulp-check-deps');

gulp.task('check:deps', function() {
    return gulp.src('package.json').pipe(checkDeps());
});
```

### Configuration

| Option                 | Default | Description                                                                                                       |
|------------------------|---------|-------------------------------------------------------------------------------------------------------------------|
| npmPath                | `npm`   | Path to the `npm` binary                                                                                          |
| npmArgs                | `[]`    | Extra arguments passed to `npm outdated` (for example `--registry`)                                               |
| failForDevDependencies | `true`  | Fail if any dev. dependency is outdated                                                                           |
| failForGitDependencies | `false` | Fail if there is any dependency required through `git`                                                            |
| failLevel              | `minor` | Fail if at least a release of the given level exists (`minor` will fail if there is a new minor or patch release) |

Here is how you would do to use a custom NPM registry and make the task fail if it finds any git dependency:

```js
//gulpfile.js

var checkDeps = require('gulp-check-deps');

gulp.task('check:deps', function() {
    var checkDepsConfig = {
        npmArgs: ['--registry', 'http://private-npm.local'],
        failForGitDependencies: true
    };

    return gulp.src('package.json').pipe(checkDeps(checkDepsConfig));
});
```

### License

[The MIT License (MIT)](LICENSE)

Copyright (c) 2015 PMSIpilot
