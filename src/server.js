var express = require("express"),
    server = express(),
    port = 8000;

server.use(express.static(__dirname));

server.listen(port, function() {
  console.log("Server listening!");
});

