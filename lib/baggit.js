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
var cconsole = require('colorize').console;

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';

function assert(condition, msg) {
    if(!condition) {
        throw msg;
    }
}

function copyFileToBaggitDirectory(src) {
    var defer = q.defer();

    fs.exists(BASE_DIRECTORY, function(exists) {
        if(exists) {
            fs.exists(src, function(exists) {
                if(exists) {
                    var dst = BASE_DIRECTORY + path.resolve(src);
                    var dstDir = path.dirname(dst);
                    cco
                    fsExt.mkdir(dstDir, '0777', true, function(res) {
                        if(res) {
                            defer.reject();
                        } else {
                            var input = fs.createReadStream(src);
                            var output = fs.createWriteStream(dst);
                            input.pipe(output);
                            defer.resolve(path.resolve(src));
                        }
                    });
                } else {
                    defer.reject('file does not exist');
                }
            });
        } else {
            defer.reject('.baggit storage directory does not exist')            
        }
    });

    return defer.promise;
}

function commitBaggitFile(file) {
    cconsole.log('Copying ' + file + ' into ' + BASE_DIRECTORY);
    var oldWorkingDirectory = process.cwd();
    process.chdir(BASE_DIRECTORY);
    var status = _.bind(spawn, this, 'git', ['status']);
    var add = _.bind(spawn, this, 'git', ['add', '.' + path.sep + file]);
    var commit = _.bind(spawn, this, 'git', ['commit', '-am', file]);
    var push = _.bind(spawn, this, 'git', ['push']);


    var promise = status().then(add).then(commit).then(push).then(function() {
        process.chdir(oldWorkingDirectory);
        return file;
    });
    return promise;
}

function printLink(file) {
    var url = encodeURI('https://raw.github.com/pwmckenna/.baggit/master' + file);
    tinyUrl.shorten(url, function(err, shortened) {
        if(err) {
            cconsole.log(err);
            cconsole.log(url);
        } else {
            cconsole.log(shortened);            
        }
    });

    // convert
    // /Users/pwmckenna/tmp/tmp96.tmp
    // to
    // https://raw.github.com/pwmckenna/baggit_files/master/Users/pwmckenna/tmp/tmp99.tmp
}

function parseFileArgument() {
    var defer = q.defer();
    if(process.argv.length === 3) {
        defer.resolve(process.argv[2]);
    } else {
        defer.reject('\t\t\tUSAGE:\tbaggit FILE');
    }
    return defer.promise;
}

function init() {
    console.log('\n\n\n\t\t\tWelcome to Baggit!');
    require('./logo').print();
    console.log('\n\n\n');

    var parse = parseFileArgument();
    parse.then(copyFileToBaggitDirectory)
        .then(commitBaggitFile)
        .then(printLink)
        .fail(function(err) {
            cconsole.log('#red[' + err + ']');
            console.log('\n\n\n');
        });
}

init();