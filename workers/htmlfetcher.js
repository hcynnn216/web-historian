// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//check every minute through the list of sites.txt

//run a isUrlArchived on all the items in sites.txt

//if there is a false detected
  //then we will execute downloadUrls
  //and makeArchive
// var handler = require('request-handler');
var archive = require('../helpers/archive-helpers');

var http = require('http');

module.exports = function(callback, opt) {

  var request = http.request(opt, function(response) {
    var res = [];
    // console.log('STATUS: ' + response.statudCode);
    // console.log('HEADERS: ' + JSON.stringify(response.headers));
    // response.setEncoding('utf8');
    response.on('data', function(chunk) {
      // console.log('BODY: ' + chunk);
      res.push(chunk);
      request.write('data');
    });
    response.on('end', function() {
      archive.makeFile(res.join(''), opt.host); 
      callback(res.join(''));
      request.end();
    });
  });


  request.write('data');

};

var loadJSONP = function ( url, callback ) {

  // Create script with url and callback (if specified)
  var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
  var script = window.document.createElement( 'script' );
  script.src = url + (url.indexOf( '?' ) + 1 ? '&' : '?') + 'callback=' + callback;

  // Insert script tag into the DOM (append to <head>)
  ref.parentNode.insertBefore( script, ref );

  // After the script is loaded (and executed), remove it
  script.onload = function () {
    this.remove();
  };



};

