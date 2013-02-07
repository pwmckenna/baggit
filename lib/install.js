var GitHubApi = require('github');
var gitty = require('./gitty');
var prompt = require('prompt');
var path = require('path');
var cconsole = require('colorize').console;
var _ = require('underscore');
var logo = require('./logo');

var github = new GitHubApi({
	version: '3.0.0',
});

var BASE_DIRECTORY = process.env.HOME + path.sep + '.baggit';

var onClone = function(username, password, error, success) {
	var baggitRepository = new gitty.Repository(BASE_DIRECTORY);

	var onPush = function(err, success) {
		cconsole.log('Setup Complete'.green);
		cconsole.log('Baggit Away!'.bold);
	};

	var onCommitEmpty = function(err, success) {
		cconsole.log('Pushing gh-pages branch to GitHub'.bold);
		baggitRepository.push('origin', 'gh-pages', onPush, {
			user: username,
			pass: password
		});
	};

	var onBranchAndCheckout = function(err, success) {
		cconsole.log('Creating gh-pages branch'.bold);
		baggitRepository.commitEmpty(onCommitEmpty);
	};

	var onBranches = function(err, branches) {
		if(branches.current === null) {
			baggitRepository.branchAndCheckout('gh-pages', onBranchAndCheckout);
		} else if(branches.current === 'gh-pages') {
			cconsole.log('Setup Complete'.green);
			cconsole.log('Baggit Away!'.bold);
		} else {
			cconsole.log('#red[Why the fuck is ' + branches.current + ' a baggit branch?!?]')
		}
	};

	baggitRepository.branches(onBranches);
}

var createCallback = function(username, password) {
	cconsole.log('Cloning .baggit directory'.bold);
	var url = 'git@github.com:' + username  + '/.baggit.git';
	var baggit = new gitty.clone(BASE_DIRECTORY, url, _.partial(onClone, username, password), {
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

