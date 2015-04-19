var request = require('request'),
	cheerio = require('cheerio'),
	express = require('express'),
	moment = require('moment'),
	app = express(),
	server,
	headers = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'],
	edison_options = {
		uri: 'http://restaurangedison.se/lunch'
	},
	weekInfo = {};

// Add a proxy if http_proxy is set in the environment variables
if (process.env.http_proxy !== undefined) {
	edison_options.proxy = process.env.http_proxy;
}

// Static files (.html, .css, .js et c)
app.use(express.static('public'));

// Respond with the index.html file if root is requested 
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

var newGet = function(req, res) {
	var lunches = require('./lib/lunchGetter');
	var restaurant = 'edison'; //default to edison
	if (req.query.restaurant) {
		restaurant = req.query.restaurant;
	}
	var data = lunches.getLunchesFromRestaurant(restaurant, function(err, data) {
		if (err){
			return res.status(401).send(err);
		}
		res.jsonp(data);
	});
};

app.get('/get_lunches', newGet);

var clearCache = function(req, res) {
	if (!req.query.restaurant) {
		res.status(401).jsonp('Please provide restaurant ("?restaurant=<name>")');
	};
	weekInfo = {};
	res.send('Cache was cleared!');
};
app.get('/clear_cache', clearCache);

// Start the server
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
server = app.listen(port, ip, function() {
	console.log('Listening on port %d', server.address().port);
});
