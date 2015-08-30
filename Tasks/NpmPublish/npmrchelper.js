// Copyright 2015 Tiago Pascoal 
// more info at https://github.com/tspascoal/tsp-agent-tasks

var npmrcHelper = function () {
    this.path = require('path');
    this.fs = require('fs');
    this.url = require('url');
    this.util = require('util');

    // private function, copies a file (assumes is a file, doesn't check if it is)
    // if target exists, it overwrites
    // meant to copy small files. Not very efficient and it is blocking
    this._copySync = function (source, dest, options) {
        options = options || {};

        options.encoding = null;

        source = this.path.resolve(source);

        var content = this.fs.readFileSync(source);

        this.fs.writeFileSync(dest, content,options);
    }
};

npmrcHelper.prototype.getNpmrcPath = function (packageRootPath) {
    return this.path.join(packageRootPath, '.npmrc');
};

npmrcHelper.prototype.getNpmrcBakPath = function (packageRootPath) {
    return this.getNpmrcPath(packageRootPath) + ".bak";
};

npmrcHelper.prototype.setAuthTokenSync = function (registry, authToken, packageRootPath) {
    var npmrc = this.getNpmrcPath(packageRootPath);
    var npmrcBak = this.getNpmrcBakPath(packageRootPath);

    if (this.fs.existsSync(npmrc)) {
        this._copySync(npmrc, npmrcBak, { mode: 0666 });
    }

    this.fs.appendFileSync(npmrc, '\n', { mode: 0600 });

    var registryUrl = this.url.parse(registry);
    this.fs.appendFileSync(npmrc, this.util.format('//%s/:_authToken=%s\n', registryUrl.host, authToken));
};

npmrcHelper.prototype.cleanNpmrcSync = function (packageRootPath) {

    var npmrc = this.getNpmrcPath(packageRootPath);
    var npmrcBak = this.getNpmrcBakPath(packageRootPath);

    if (npmrc && this.fs.existsSync(npmrc)) {
        this.fs.unlinkSync(npmrc);
    }
    if (npmrcBak && this.fs.existsSync(npmrcBak)) {
        this.fs.renameSync(npmrcBak, npmrc);
    }
};

module.exports = new npmrcHelper();