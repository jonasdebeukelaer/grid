var express = require('express');
var mysql = require('mysql');
var bodyParser = require
var router = express.Router();
var app = express()


var connection = mysql.createConnection(
	process.env.JAWSDB_URL || 
	{
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'mosaic_db'
	});

connection.connect();

// // app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'mosaic' });
});

router.get('/retrievePrepopulated/', function(req, res) {
	var queryString = "SELECT * FROM matrix";
	connection.query(queryString, function(err, rows) {
		if (err) throw err;

		try {
			var cellMap = {};
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				cellMap[("cell-" + row.coordinates)] = {
					colour: ("#" + row.colour),
					user: row.user
				}
			}
			res.send(cellMap);
		} catch (err) {
			throw err;
		}
	})
})

router.post('/pixel/', function(req, res) {

	//check pixel not already populated by different user
	var coords = req.body.coords;
	var colour = req.body.colour;
	var user = req.body.user;
	var queryString = "SELECT COUNT(*) FROM matrix WHERE coordinates='" + coords + "'";


	connection.query(queryString, function(err, rows) {
		if (err) throw err;
		if (rows != 0) res.send("has already been edited!");

		//if not already populated
		var insertString = "INSERT INTO matrix SET ?";
		var data = {
			coordinates: coords,
			colour: colour,
			user: user
		}

		connection.query(insertString, data, function(err, result) {
			if (err) throw err;
		})

	})
})

module.exports = router;
