let express = require("express");
let cors = require('cors');

let app = express();
let port = 3010;
let mongoose = require('mongoose'),
  Task = require('./API/models/scrapingModel'), //created model loading here
  bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/cloth", { useFindAndModify: false,  useNewUrlParser: true, useUnifiedTopology: true}).catch((e) => {
  console.error(e)
  console.error('mongodb://localhost/cloth')
} );

app.use(cors());

app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(bodyParser.json({limit: '50mb'}));

let routes = require('./API/routes/scrapingRoutes'); //importing route
routes(app); //register the route

app.listen(port, () => {
  console.log("Server running on port " +  port + " " + new Date());
});

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
