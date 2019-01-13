var express = require("express");
var app = express();
var port = 3000;
var mongoose = require('mongoose'),
  Task = require('./API/models/scrapingModel'), //created model loading here
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Clothdb',{ useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var routes = require('./API/routes/scrapingRoutes'); //importing route
routes(app); //register the route

app.listen(port, () => {
 console.log("Server running on port 3000");
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });