var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/database1';

var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
var app = express()

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'mosaic' });
	});

	router.post('/pixel/', function(req, res) {
		//add req.position and req.colour to database
	});

	module.exports = router;


	console.log("and done")


    //Close connection
    db.close();
  }
});