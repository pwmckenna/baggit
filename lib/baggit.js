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

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';

function assert(condition, msg) {
    if(!condition) {
        throw msg;
    }
}

function setupBaggitDirectory() {
    var exists = fs.existsSync(BASE_DIRECTORY);
    if(!exists) {
        var res = fs.mkdirSync(BASE_DIRECTORY, '0777');
        assert(!res, 'failed to create ~/.baggit directory');
    }
}

function copyFileToBaggitDirectory(src) {
    var dst = BASE_DIRECTORY + path.sep + path.basename(src);
    console.log('copying file', src, dst);
    var input = fs.createReadStream(src);
    var output = fs.createWriteStream(dst);
    input.pipe(output);
}

function usage() {
    console.log('baggit [FILE]');
}

function parseFileArgument() {
    if(process.argv.length === 3) {
        return process.argv[2];
    } else {
        usage();
        process.exit(0);
    }
}

function init() {
    var file = parseFileArgument();
    setupBaggitDirectory();
    copyFileToBaggitDirectory(file);
}

init();