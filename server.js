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
app.use(express.static(__dirname));

// Respond with the index.html file if root is requested 
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

var parseLunches = function(body) {
	var weeklyInfo = [],
		$ = cheerio.load(body),
		days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

	days.forEach(function(e, i) {
		// Get all table rows for a day
		var $dayTableRows = $('div#'+e+' > table tr'),
		dayInfo = [];

		$dayTableRows.each(function(i, e){
			var $this = $(this),
			type = $this.find('.course_type').text(),
			food = $this.find('.course_description').text();
			dayInfo.push({
				type: type,
				food: food
			});
		});

		weeklyInfo.push({
			day: e,
			info: dayInfo
		});
	});

	return weeklyInfo;	
}

var getLunches = function(req, res) {
	request(edison_options, function (error, response, body) {
		
		// Cache the weeklyInfo
		var week = moment().week();
		if (weekInfo[week] === undefined) {
			var weeklyInfo = parseLunches(body);
			weekInfo[week] = weeklyInfo;
		}

		// Send the response
		res.send(weekInfo[week]);
	});
};

app.get('/get_lunches', getLunches);

var clearCache = function(req, res) {
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
