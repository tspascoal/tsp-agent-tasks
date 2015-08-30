// Copyright 2015 Tiago Pascoal 
// more info at https://github.com/tspascoal/tsp-agent-tasks

var path = require('path');
var fs = require('fs');
var util = require('util');
var tl = require('vso-task-lib');
var npmrcHelper = require('./npmrchelper');

var npm = new tl.ToolRunner(tl.which('npm', true));

var registry = tl.getInput('registry');
var packageJsonPath = tl.getPathInput('packageJsonPath');
var authToken = tl.getInput('authToken');
var access = tl.getInput('access');
var tag = tl.getInput('tag');

tl.debug('registry: ' + registry);
tl.debug('packageJsonPath: ' + packageJsonPath);
tl.debug('authToken: ' + authToken);
tl.debug('access: ' + access);
tl.debug('tag: ' + tag);

tl.debug('checking if ' + packageJsonPath + ' exists');

if (fs.existsSync(packageJsonPath) == false) {
    tl.error(packageJsonPath + ' file not found.');
    tl.exit(1);
}

var packageRootPath = path.resolve(path.dirname(packageJsonPath) + '/..');
var packagePublishName = path.basename(path.dirname(packageJsonPath));

// Change to package.json parent folder so .npmrc can be properly read (only way to set credentials, without calling npm adduser)
tl.debug('chaging cwd to ' + packageRootPath);
tl.cd(packageRootPath);

// Set the registry just for this call and without affecting other agents
tl.debug('setting registry ' + registry);
process.env["npm_config_registry"] = registry;

// If auth token has been defined, set it on project .npmrc 
// the file will be backuped before the authentication token is appended
// and restored afterwards
if (authToken) {
    npmrcHelper.setAuthTokenSync(registry, authToken, packageRootPath);
    process.env['_auth'] = authToken; // Cover old NPM version
}

npm.arg('publish');
npm.arg(packagePublishName);

if (tag) {
    npm.arg('--tag');
    npm.arg(tag);
}
if (access) {
    npm.arg('--access');
    npm.arg(access);
}

tl.debug('going to publish package: ' + packagePublishName);

npm.exec()
.then(function (code) {
    npmrcHelper.cleanNpmrcSync(packageRootPath);
    tl.exit(code);
})
.fail(function (err) {
    tl.debug('taskRunner failed');
    npmrcHelper.cleanNpmrcSync(packageRootPath);
    tl.exit(1);
})