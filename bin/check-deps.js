#!/usr/bin/env node

'use strict';
var fs = require('fs');
var checkDeps = require('../index.js');
var argv = require( 'argv' );

var args = argv.option([
  {
    name: 'package',
    short: 'p',
    type: 'path',
    description: 'Specify the path of you package.json, default is current folder',
  },
  {
    name: 'dev',
    short: 'd',
    type: 'boolean',
    description: 'Fail for devDependencies'
  },
  {
    name: 'git',
    short: 'g',
    type: 'boolean',
    description: 'Fail for git dependencies'
  },
  {
    name: 'prerelease',
    short: 'r',
    type: 'boolean',
    description: 'Fail for pre-release'
  },
  {
    name: 'level',
    short: 'l',
    type: 'int',
    description: 'Fail Level in: [' + Object.keys(checkDeps.levels).map(function(name) {
      return name + ': ' + checkDeps.levels[name];
    }).join('|') + '], default is :' + checkDeps.defaults.failLevel
  }
]).run();

var packageFilePath = args.options.package || 'package.json';

fs.readFile(packageFilePath, function(err, data) {
  var config = {
    failForDevDependencies: args.options.dev || false,
    failForGitDependencies: args.options.git || false,
    failForPrerelease: args.options.prerelease || false,
    failLevel: args.options.level || checkDeps.defaults.failLevel,
    isCliMode: true
  };
  checkDeps(config).write({ path: packageFilePath, contents: data });
});
