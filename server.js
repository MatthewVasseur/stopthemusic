// requires
var http = require("http");
var url = require("url");
var fs = require("fs");
var helper = require("./helper")
var path = require("path");

var port = 8888; // port of Server
var srvURL = "localhost"; // url of Server

// start(): initializes & starts the server
function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname; //url pathname
    var ext = path.extname(pathname);

    console.log("Request for " + pathname + " received."); //logs request

    console.log("About to route a request for " + pathname); //logs route

    if (pathname == "/") {
      console.log("Request handler 'index' was called.\n"); //logs handle

      // renders index.html
      var page = "./index.html";
      var content = fs.readFileSync(page, 'utf-8');
      helper.display(response, 200, "text/html", content);

    } else if(ext == ".css") {
      console.log("Request handler '.css' was called.\n"); //logs handle

      // renders .css
      var page = __dirname + pathname;
      var content = fs.readFileSync(page, 'utf-8');
      helper.display(response, 200, "text/css", content);

    } else if (ext == ".js") {
      console.log("Request handler '.js' was called.\n"); //logs handle

      // renders .js
      var page = __dirname + pathname;
      var content = fs.readFileSync(page, 'utf-8');
      helper.display(response, 200, "text/javascript", content);

    } else {
      console.log("No request handler found for " + pathname + "\n"); //logs lack of handle

      // renders 404error.html
      var page = "./404error.html";
      var content = fs.readFileSync(page, 'utf-8');
      helper.display(response, 404, "text/html", content);
    }
  }

  http.createServer(onRequest).listen(port, srvURL); //physically creates server
  console.log("Server has started.\n" +
              "Listening at " + srvURL + ":" + port + "\n"); //logs creation
}

start(); //starts the server via start() function
