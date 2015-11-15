"use strict";
var express = require("express"),
    server = express(),
    port = 8000,
    nodemailer = require("nodemailer"),
    bodyParser = require('body-parser'),
    smtpTransport = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "boxnest@gmail.com",
        pass: "boxnestbox"
      }
    });

server.use(bodyParser.json());       // to support JSON-encoded bodies

server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

server.use(express.static(__dirname));

server.post("/send", function(req, res) {
  var mailOptions = {
    to: "joseph.le14@gmail.com",
    subject: req.body.subject + " - " + req.body.email,
    text: req.body.message
  },
  resObj = {};

  res.setHeader('Content-Type', 'application/json');
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(err, mailRes) {
    if (err) {
      console.log(error);
      resObj["status"] = 0;
      resObj["error"] = err;
    }
    else {
      console.log("Message sent: " + mailRes.message);
      resObj["status"] = 1;
    }
    res.end(JSON.stringify(resObj));
  })

});

server.listen(port, function() {
  console.log("Server listening!");
});

