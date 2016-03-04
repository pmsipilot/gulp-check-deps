# check-deps [![Build Status](https://travis-ci.org/pmsipilot/gulp-check-deps.svg?branch=master)](https://travis-ci.org/pmsipilot/gulp-check-deps)

[Gulp](http://gulpjs.com/) plugin to check your dependencies (through npm outdated)

![check-deps](demo.gif)

## Why ?

NPM and its `outdated` command are good tools to gather informations about the state of a project's dependencies. The problem with
it is that it never fails. Even when there are outdated dependencies, the command exits with a `0` status.

Moreover, you cannot configure it to warn only if some criteria are satisifed, for example if you want to consider a dependency outdated
only when there is a new minor or patch release.

This plugin adresses those two issues:

* It fails when there is something outdated
* It lets you configure when you want it to fail

It is really CI friendly !

## How to use in CLI

Globally installed, simply run it

```
check-deps -p path/to/package.json
```

See help for configuration:

```
check-deps --help
```

When saved in a project:

```
//package.json
{
  //...
  "scripts": {
    "check-deps": "check-deps -d -l 1"
  },
  "devDependencies": {
    "gulp-check-deps": "*"
  }
}
```

### Configuration

| Option                 | Type       | Default | Description                                                                                                       |
|------------------------|------------|---------|-------------------------------------------------------------------------------------------------------------------|
| npmPath                | `string`   | `npm`   | Path to the `npm` binary                                                                                          |
| npmArgs                | `string[]` | `[]`    | Extra arguments passed to `npm outdated` (for example `--registry`)                                               |
| failForDevDependencies | `boolean`  | `true`  | Fail if any dev. dependency is outdated                                                                           |
| failForGitDependencies | `boolean`  | `false` | Fail if there is any dependency required through `git`                                                            |
| failForPrerelease      | `boolean`  | `true`  | Fail if there is any dependency available as `alpha`, `beta` or `rc`                                              |
| failLevel              | `string`   | `minor` | Fail if at least a release of the given level exists (`minor` will fail if there is a new minor or patch release) |
| ignore                 | `string[]` | `[]`    | Do not make the task fail for the given dependencies                                                              |

Here is how you would do to use a custom NPM registry and make the task fail if it finds any git dependency:

```js
//gulpfile.js

var checkDeps = require('check-deps');
var packageFilePath = 'package.json';

fs.readFile(packageFilePath, function(err, data) {
  var checkDepsConfig = {
      npmArgs: ['--registry', 'http://private-npm.local'],
      failForGitDependencies: true
  };

  checkDeps(checkDepsConfig).write({ path: packageFilePath, contents: data });
});
```

### License

[The MIT License (MIT)](LICENSE)

Copyright (c) 2015 PMSIpilot
