var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, function(err, data) {
    if (err) { throw err; }
    callback(data);
  });
};

exports.isUrlInList = function(string, callback) {
  fs.readFileSync(this.paths.list, function(err, data) {
    if (err) { throw err; }
    callback((data.indexOf(string) < 0) ? false : true);
  });
};

exports.addUrlToList = function(string) {
  fs.appendFile(this.paths.list, string, function(err, data) {
    if (err) { throw err; }
    console.log('data appeneded!');
  });
};

exports.isUrlArchived = function() {

};

exports.downloadUrls = function() {

};

exports.makeFile = function(content, name) {
  fs.writeFile(this.paths.archivedSites + '/' + name, content, function(err, content) {
    if (err) { throw err; }
    console.log('File Saved!');
  });
};
