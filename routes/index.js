var express = require('express');
var bodyParser = require
var router = express.Router();
var app = express()

// // app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'mosaic' });
});

router.post('/pixel/', function(req, res) {
	//add req.position and req.colour to database
})

module.exports = router;
