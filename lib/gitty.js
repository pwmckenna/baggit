var gitty = require('gitty');

gitty.Repository.prototype.fetch = function(callback) {

    // save the scope of the repository
    var repo = this
    // create a new instance of Command
      , cmd = new gitty.Command(repo.path, 'fetch', [], {});

    // execute the command and determine the outcome
    cmd.exec(function(error, stdout, stderr) {
        var err = error || stderr;

        // call the callback function in the repository scope
        // passing it err and stdout
        callback.call(repo, err, stdout);
    });
};

gitty.Repository.prototype.branchAndCheckout = function(name, callback) {

    // save the scope of the repository
    var repo = this
    // create a new instance of Command
      , cmd = new gitty.Command(repo.path, 'checkout', ['-b'], name);

    // execute the command and determine the outcome
    cmd.exec(function(error, stdout, stderr) {
        var err = error || stderr;

        // call the callback function in the repository scope
        // passing it err and stdout
        callback.call(repo, err, stdout);
    });
};

gitty.Repository.prototype.commitEmpty = function(callback) {

    // save the scope of the repository
    var repo = this
    // create a new instance of Command
      , cmd = new gitty.Command(repo.path, 'commit', ['--allow-empty', '-m'], "init");

    // execute the command and determine the outcome
    cmd.exec(function(error, stdout, stderr) {
        var err = error || stderr;

        // call the callback function in the repository scope
        // passing it err and stdout
        callback.call(repo, err, stdout);
    });
};

gitty.Repository.prototype.config = function(key, callback) {

    // save the scope of the repository
    var repo = this
    // create a new instance of Command
      , cmd = new gitty.Command(repo.path, 'config', [], key);

    // execute the command and determine the outcome
    cmd.exec(function(error, stdout, stderr) {
        var err = error || stderr;

        // call the callback function in the repository scope
        // passing it err and stdout
        callback.call(repo, err, stdout);
    });
};

module.exports = gitty;