var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('http');
var htmlfetcher = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var method = req.method;
  var url = req.url;
  var body = [];
  var statusCode = 200;

  var finish = function(input) {
    res.write(JSON.stringify(input));
    res.end();
  };
  var check = function(a) {
    return a;
  };


  var readContent = function(callback) {
    fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
      if (err) { console.log(err); }
      callback(data);
    });
  };

  if (method === 'POST') {

    var options = {
      host: 'www.google.com',
      port: 80,
      path: '/',
      method: 'POST'
    };

    statusCode = 302;

    if (!archive.isUrlInList('www.example.com', check)) {
      archive.addUrlToList('www.example.com');
    }

    req.on('error', function(err) {
      console.log(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
    //   // body = Buffer.concat(body).toString();

      res.on('error', function(err) {
        console.log(err);
      }); 

      //if file exists will return true, otherwise will return false
      //note the file name is hard coded
      fs.stat(archive.paths.archivedSites + '/' + 'www.google.com', function(err, stats) {
        if (err) { return console.log('doesn\' exist!'); }
        console.log(stats.isFile());
      });

      res.writeHead(statusCode, {'Content-Type': 'application/json'});

      var resBody = {
        method: method,
        url: url,
        body: htmlfetcher(function(content) {
          // console.log(content.toString());
          finish(content.toString());
        }, options)
      };

    });

  } else {
    var options = {
      host: 'www.google.com',
      port: 80,
      path: '/',
      method: 'GET'
    };

    req.on('error', function(err) {
      console.log(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
    //   // body = Buffer.concat(body).toString();

      res.on('error', function(err) {
        console.log(err);
      }); 

      fs.stat(archive.paths.archivedSites + '/' + 'www.google.com', function(err, stats) {
        if (err) { return console.log('doesn\'t exist!'); }
        console.log(stats.isFile());
      });

      //if url is not archived return 404 status
      if (archive.isUrlArchived('www.google.com', function(arg) {
        if (!arg) { return false; }
        return arg;
      })) {
        console.log('hi');
        statusCode = 404;
      }

      res.writeHead(statusCode, {'Content-Type': 'application/json'});

      var resBody = {
        method: method,
        url: url,
        body: htmlfetcher(function(content) {
          // console.log(content.toString());
          finish(content.toString());
        }, options)
      };

    });
  }

};
