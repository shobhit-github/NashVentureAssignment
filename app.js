
var fs = require('fs');
var http = require('http');
var router = require('./router');

var request = require('request');


// Handle your routes here, put static pages in ./public and they will server
router.register('/', function(req, res) {
  fs.readFile('index.html', function(err, html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
  });
});


router.register('/check_url', function(req, res) {

  res.writeHead(200, {'Content-Type': 'application/json'});
  
  urlExists( getParam( 'url', req.url), function(err, isExist) {
    if (!isExist) 
      res.end(JSON.stringify({status: false, response: 'failed'}));

  	res.end(JSON.stringify({status: true, response: 'success'}));
  })
  
});


// We need a server which relies on our router
var server = http.createServer(function (req, res) {
  handler = router.route(req);
  handler.process(req, res);
});


// utils functions
const getParam = function ( name, url ) {
    if (!url) return null;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

const urlExists = function (url, cb) {
  request({ url: url, method: 'HEAD' }, function(err, res) {
    if (err) return cb(null, false);
    cb(null, /4\d\d/.test(res.statusCode) === false);
  });
}


// Start it up
server.listen(8000);
console.log('Server running');
