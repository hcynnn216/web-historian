var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('http');
var htmlfetcher = require('../workers/htmlfetcher');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var method = req.method;
  var url = req.url;
  var body = [];
  var headers = {
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
  };

  //declare a callback for finish
  var finish = function(input) {
    res.write(JSON.stringify(input));
    res.end();
  };

  var readContent = function(callback, string) {
    fs.readFile(string, function(err, data) {
      if (err) { console.log(err); }
      callback(data.toString());
    });
  };

  var identity = function(a) {
    return a;
  };

  console.log('this is the urllist', archive.paths.list);

  if (method === 'GET') {
    if (archive.isUrlInList(url.slice(1), function(boolean) {
      if (boolean) {
        if (archive.isUrlArchived(url.slice(1), function(boolean) {
          res.writeHead(200, headers);
          readContent(finish, archive.paths.archivedSites + url);
        })) { 
          return;
        } else {
          htmlfetcher(finish, {host: url.slice(1) });
        }
      } else {
        archive.addUrlToList(url.slice(1), function() {
          console.log('URL is added to list');
        });
        htmlfetcher(finish, {host: url.slice(1) });
      }
    })) {
      return;
    }

    if (url === '/') {
      console.log('something');
      res.writeHead(200, headers);
      readContent(finish, archive.paths.siteAssets + '/index.html');
      //else if it is archived

    } else {
      res.writeHead(404, headers);
      res.end();
    //   var options = {
    //     host: url.slice(1),
    //     port: 80,
    //     path: '/',
    //     method: 'GET'
    //   };
    //   if (!isUrlArchived(url, identity)) {
    //     console.log('we are at line 76');
    //     res.writeHead(200, headers);
    //     htmlfetcher(function(content) {
    //       finish(content.toString());
    //     }, options);
    //   } 
    } 
  } else if (method === 'POST') {
    res.writeHead(302, headers);


  }

};
