#! /usr/bin/env node

/*
 * baggit
 * https://github.com/pwmckenna/baggit
 *
 * Copyright (c) 2012 Patrick Williams
 * Licensed under the MIT license.
 */
"use strict";

var fs = require('fs');
var _ = require('underscore');
var q = require('q');
var path = require('path');
var fsExt = require('node-fs');
var spawn = require('./spawn');
var tinyUrl = require('nj-tinyurl');

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';

function assert(condition, msg) {
    if(!condition) {
        throw msg;
    }
}

function setupBaggitDirectory() {
    var ret = q.defer();
    fs.exists(BASE_DIRECTORY, function(exists) {
        if(exists) {
            ret.resolve();
        } else {
            fs.mkdir(BASE_DIRECTORY, '0777', function(res) {
                if(res) {
                    ret.reject(res);
                } else {
                    ret.resolve();
                }
            });
        }
    });
    return ret.promise;
}

function copyFileToBaggitDirectory(src) {
    var ret = q.defer();
    fs.exists(src, function(exists) {
        if(exists) {
            var dst = BASE_DIRECTORY + path.resolve(src);
            var dstDir = path.dirname(dst);
            fsExt.mkdir(dstDir, '0777', true, function(res) {
                if(res) {
                    ret.reject();
                } else {
                    var input = fs.createReadStream(src);
                    var output = fs.createWriteStream(dst);
                    input.pipe(output);
                    ret.resolve(path.resolve(src));
                }
            });
        } else {
            ret.reject('file does not exist');
        }
    });
    return ret.promise;
}

function commitBaggitFile(file) {
    var oldWorkingDirectory = process.cwd();
    process.chdir(BASE_DIRECTORY);
    var status = _.bind(spawn, this, 'git', ['status']);
    var add = _.bind(spawn, this, 'git', ['add', '.' + path.sep + file]);
    var commit = _.bind(spawn, this, 'git', ['commit', '-am', file]);
    var push = _.bind(spawn, this, 'git', ['push']);


    var ret = status().then(add).then(commit).then(push).then(function() {
        process.chdir(oldWorkingDirectory);
        return file;
    });
    return ret;
}

function printLink(file) {
    var url = encodeURI('https://raw.github.com/pwmckenna/.baggit/master' + file);
    tinyUrl.shorten(url, function(err, shortened) {
        if(err) {
            console.log(err);
            console.log(url);
        } else {
            console.log(shortened);            
        }
    });

    // convert
    // /Users/pwmckenna/tmp/tmp96.tmp
    // to
    // https://raw.github.com/pwmckenna/baggit_files/master/Users/pwmckenna/tmp/tmp99.tmp
}

function usage() {
    console.log('baggit [FILE]');
}

function parseFileArgument() {
    var ret = q.defer();
    if(process.argv.length === 3) {
        ret.resolve(process.argv[2]);
    } else {
        ret.reject();
    }
    return ret.promise;
}

/**
  * fork git@github.com:pwmckenna/baggit_files.git
  * clone git@github.com:user/baggit_files.git
  * copy file
  * add file
  * commit file
  * push file
  * console.log public raw file url
**/

function init() {
    var file = parseFileArgument();
    var copy = _.bind(copyFileToBaggitDirectory, this, file);
    setupBaggitDirectory()
        .then(parseFileArgument)
        .then(copyFileToBaggitDirectory)
        .then(commitBaggitFile)
        .then(printLink);
}

init();