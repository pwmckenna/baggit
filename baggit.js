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
var cconsole = require('colorize').console;
var logo = require('./lib/logo');
var colors = require('colors');
var gitty = require('./lib/gitty');

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
                    fsExt.mkdir(dstDir, '0777', true, function(res) {
                        if(res) {
                            defer.reject('\tunabled to create ' + dstDir);
                        } else {
                            var input = fs.createReadStream(src);
                            var output = fs.createWriteStream(dst);
                            var pipe = input.pipe(output);
                            input.on("end", function() {
                                defer.resolve(path.resolve(src));
                            });
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

    var baggitRepository = new gitty.Repository(BASE_DIRECTORY);
    baggitRepository.add(['.' + path.sep + file], function(err) {
        if(err) {
            defer.reject('File add failed');
        } else {
            console.log('File added');
            baggitRepository.commit(file, function(err, output) {
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
    var baggitRepository = new gitty.Repository(BASE_DIRECTORY);
    baggitRepository.config('remote.origin.url', function(err, remotes) {

        //parse the remote to see which gh-pages sub domain the fail will be hosted on
        var start = remotes.indexOf(':') + 1;
        var ss = remotes.substr(start);
        var end = ss.indexOf('/');
        var user = ss.substr(0, end);

        var url = encodeURI('http://' + user + '.github.com/.baggit' + file);
        cconsole.log('#bold[#green[' + url.underline.blue + ']]');
        defer.resolve();
    });
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
    parse.done(function(file) {
        logo.file(path.basename(file));
    });
    var copy = parse.then(copyFileToBaggitDirectory);
    var commit = copy.then(commitBaggitFile);
    var print = commit.then(printLink);

    print.fail(function(msg) {
        cconsole.log('#red[' + msg + ']');
    });
}
if(require.main === module) {
    baggit();
} else {
    module.export = baggit
}