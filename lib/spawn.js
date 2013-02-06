var q = require('q');
var cconsole = require('colorize').console;

module.exports = function() {
    var ret = new q.defer();
    var proc = require('child_process').spawn.apply(this, arguments);
    proc.stdout.on('data', function(data) {
        cconsole.log(data);
    });
    proc.stderr.on('data', function(data) {
        cconsole.log(data);
    });
    proc.on('exit', function(code) {
        if(code === 0) {
            ret.resolve(code);
        } else {
            ret.reject(code);
        }
    });
    return ret.promise;
};
