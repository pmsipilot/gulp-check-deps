# check-deps [![Build Status](https://travis-ci.org/pmsipilot/gulp-check-deps.svg?branch=master)](https://travis-ci.org/pmsipilot/gulp-check-deps)

Check your node dependencies (through npm outdated)

_In case you are looking for the cli binary, you should take a look to [check-deps](FIXME) since this library has been split for npm_

![check-deps](demo.gif)

## How to use ?


```js
//gulpfile.js

var checkDeps = require('gulp-check-deps');

gulp.task('check:deps', function() {
    return gulp.src('package.json').pipe(checkDeps());
});
```

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
