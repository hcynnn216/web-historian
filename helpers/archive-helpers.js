var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlfetcher = require('../workers/htmlfetcher');

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
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(string, callback) {

  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    callback((data.indexOf(string) < 0) ? false : true); 
  });
};

exports.addUrlToList = function(string, cb) {
  fs.appendFile(exports.paths.list, string, function(err, data) {
    if (err) { throw err; }
    console.log('data appeneded!');
    cb();
  });
};

exports.isUrlArchived = function(string, callback) {
  fs.stat(exports.paths.archivedSites + '/' + string, function(err, stats) {
    if (err === null) { 
      console.log('File Exists!'); 
      callback(true);
    } else if (err.code === 'ENOENT') {
      callback(false);
    } 
  });
};

exports.downloadUrls = function(arr) {
  _.each(arr, function(item, index, arr) {
    //if the arr is not in the archive
    if (!exports.isUrlArchived(item, _.identity)) {
      //call the function to download it
      var option = {
        host: item,
        port: 80,
        path: '/',
        method: 'GET'
      };
      exports.makeFile(htmlfetcher(_.identity, option), item);

    }
  });
};

exports.makeFile = function(content, name) {
  fs.writeFile(this.paths.archivedSites + '/' + name, content, function(err, content) {
    if (err) { throw err; }
    console.log('File Saved!');
  });
};
