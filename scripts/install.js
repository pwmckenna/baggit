var GitHubApi = require('github');
var gitty = require('gitty');
var prompt = require('prompt');
var path = require('path');
var cconsole = require('colorize').console;
var _ = require('underscore');
var logo = require('../lib/logo');

var github = new GitHubApi({
	version: '3.0.0',
});

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';


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
}

var createCallback = function(username, password) {
	cconsole.log('Cloning .baggit directory'.bold);
	var url = 'git@github.com:' + username  + '/.baggit.git';
	var baggit = new gitty.clone(BASE_DIRECTORY, url, function(error, success) {

		var baggitRepository = new gitty.Repository(BASE_DIRECTORY);

		baggitRepository.branches(function(err, branches) {
			if(branches.current === null) {
				baggitRepository.branchAndCheckout('gh-pages', function(err, success) {
					cconsole.log('Creating gh-pages branch'.bold);
					baggitRepository.commitEmpty(function(err, success) {
						cconsole.log('Pushing gh-pages branch to GitHub'.bold);
						baggitRepository.push('origin', 'gh-pages', function(err, success) {
							cconsole.log('Setup Complete'.green);
							cconsole.log('Baggit Away!'.bold);
						}, {
							user: username,
							pass: password
						});
					});
				});
			} else if(branches.current === 'gh-pages') {
				cconsole.log('Setup Complete'.green);
				cconsole.log('Baggit Away!'.bold);
			} else {
				cconsole.log('#red[Why the fuck is ' + branches.current + ' a baggit branch?!?]')
			}
		});
	}, {
		username: username,
		password: password
	});
};


logo.welcome();
cconsole.log('We need to create a .baggit github repo to store your baggits'.bold);
prompt.start();
prompt.get([
	{
		name: 'username',
		message: 'What is your github username?'
	},
	{
		name: 'password',
		hidden: 'true',
		message: 'What is your github password?'
	}],
	function(err, result) {
		var username = result.username;
		var password = result.password;
		github.authenticate({
			type: 'basic',
			username: username,
			password: password
		});

		github.repos.get(
			{
				user: username,
				repo: '.baggit'
			},
			function(err, res) {
				if(res) {
					createCallback(username, password);
				} else {
					cconsole.log('Creating .baggit repository'.bold);
					github.repos.create(
						{
							name: '.baggit'
						},
						_.partial(createCallback, username, password)
					);					
				}
			}
		);
	}
);

