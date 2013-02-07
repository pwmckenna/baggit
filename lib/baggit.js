#!/usr/bin/env node

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
var tinyUrl = require('nj-tinyurl');
var cconsole = require('colorize').console;
var logo = require('./logo');
var gitty = require('gitty');

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';

function assert(condition, msg) {
    if(!condition) {
        throw msg;
    }
}

function copyFileToBaggitDirectory(src) {
    cconsole.log('Copying ' + src + ' into ' + BASE_DIRECTORY);
    var defer = q.defer();

    fs.exists(BASE_DIRECTORY, function(exists) {
        if(exists) {
            cconsole.log('.baggit directory exists');
            fs.exists(src, function(exists) {
                if(exists) {
                    cconsole.log('src file exists');
                    var dst = BASE_DIRECTORY + path.resolve(src);
                    var dstDir = path.dirname(dst);
                    cconsole.log('Destination directory is ' + dstDir);
                    fsExt.mkdir(dstDir, '0777', true, function(res) {
                        if(res) {
                            defer.reject('\tunabled to create ' + dstDir);
                        } else {
                            var input = fs.createReadStream(src);
                            var output = fs.createWriteStream(dst);
                            var pipe = input.pipe(output);
                            console.log(typeof pipe);
                            defer.resolve(path.resolve(src));
                        }
                    });
                } else {
                    defer.reject('file does not exist');
                }
            });
        } else {
            defer.reject(
                '\t.baggit storage directory does not exist.\n' +
                '\tWas the install script aborted or never run?')            
        }
    });

    return defer.promise;
}

function commitBaggitFile(file) {
    var defer = new q.defer();
    var msg = 'Committing ' + file + ' to the .baggit repository';
    cconsole.log(msg);

    var baggitRepository = new gitty.Repository(BASE_DIRECTORY);

    baggitRepository.add(['.' + path.sep + file], function(err) {
        if(err) {
            defer.reject('File add failed');
        } else {
            console.log('File added');
            baggitRepository.commit(msg, function(err, output) {
                if(err) {
                    defer.reject('File commit failed');
                } else {
                    console.log('File commited');
                    baggitRepository.push('origin', 'gh-pages', function(err, success) {
                        if(err) {
                            defer.reject('File push failed');
                        } else {
                            console.log('File pushed');
                            defer.resolve(file);                    
                        }
                    });                
                }
            });            
        }
    });

    return defer.promise;
}

function printLink(file) {
    var defer = q.defer();
    var url = encodeURI('http://pwmckenna.github.com/.baggit' + file);
    cconsole.log('#green[' + url + ']');
    defer.resolve();
    return defer.promise;
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

function baggit() {
    // convert
    // /Users/pwmckenna/tmp/tmp96.tmp
    // to
    // https://pwmckenna.github.com/.baggit/Users/pwmckenna/tmp/tmp99.tmp
    var parse = parseFileArgument();
    parse.done(logo.file);
    var copy = parse.then(copyFileToBaggitDirectory);
    var commit = copy.then(commitBaggitFile);
    var print = commit.then(printLink);

    var printError = function(task, err) {
        cconsole.log(task + '  #red[' + err + ']');
        console.log('\n\n\n');
    };

    parse.fail(_.partial(printError, 'parse'));
    copy.fail(_.partial(printError, 'copy'));
    commit.fail(_.partial(printError, 'commit'));
    print.fail(_.partial(printError, 'print'));
}
if(require.main === module) {
    baggit();
} else {
    module.export = baggit
}