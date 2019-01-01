var express = require("express");
var app = express();
var port = 3000;
var mongoose = require('mongoose'),
  Task = require('./API/models/scrapingModel'), //created model loading here
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Clothdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./API/routes/scrapingRoutes'); //importing route
routes(app); //register the route

app.listen(port, () => {
 console.log("Server running on port 3000");
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });