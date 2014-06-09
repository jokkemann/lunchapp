var request = require('request'),
	cheerio = require('cheerio'),
	express = require('express'),
	app = express(),
	server,
	headers = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'],
	edison_options = {
		uri: 'http://restaurangedison.se/Bizpart.aspx?tabId=191'
	};

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

app.get('/get_lunches', function(req, res) {
	request(edison_options, function (error, response, body) {
		var	finalLunches = [],
			$ = cheerio.load(body),
			baseParagraph = $('#MyBPControlLayout_Container_535_divContainer > span p'),
			paragraph = baseParagraph.eq(0),
			textNodes = paragraph.contents().filter(function(i, el) {
				// Filter out everything that is not text elements that actually has text
				return el.type === 'text' && el.data.trim() !== '';
			});

		textNodes.each(function(i, el) {
			var current = el.data.trim(),
				// Get the first word of the current element (May be "Fredag STÄNGT")
				currentFirst = current.split(' ')[0],
				header = 0;

			// Check if this word should be considered a header
			if (headers.indexOf(currentFirst) >= 0) {
				header = 1;
			}

			finalLunches.push({header: header, text: current});
		});

		// Send the response
		res.send(finalLunches);
	});
});

// Start the server
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
server = app.listen(port, ip, function() {
	console.log('Listening on port %d', server.address().port);
});
