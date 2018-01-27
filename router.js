
var fs = require('fs');
var parser = require('url');
var handlers = {};

exports.clear = function() {
  handlers = {};
}

exports.register = function(url, method) {
  handlers[url] = createHandler(method);
}

exports.route = function(req) {
  url = parser.parse(req.url, true);
  var handler = handlers[url.pathname];
  if (!handler) handler = this.missing(req)
  return handler;
}

exports.missing = function(req) {
  // Try to read the file locally, this is a security hole, yo /../../etc/passwd
  var url = parser.parse(req.url, true);
  var path = __dirname + "/public" + url.pathname
  try {    
    data = fs.readFileSync(path);
    mime = req.headers.accepts || 'text/html'
    return createHandler(function(req, res) {
      res.writeHead(200, {'Content-Type': mime});
      res.write(data);
      res.end();
    });        
  } catch (e) { 
    return createHandler(function(req, res) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write("No route registered for " + url.pathname);
      res.end();
    });      
  }  
}


/*  Routes Handler
-----------------------------*/
var createHandler = function (method) {
  return new Handler(method);
}


Handler = function(method) {
  this.process = function(req, res) {
    params = null;
    return method.apply(this, [req, res, params]);
  }
}
