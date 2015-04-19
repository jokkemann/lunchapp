// module.exports = edisonLunch;

// var edisonLunch = function (args) {
// 	console.log('testing');
// };
var request = require('request'),
	cheerio = require('cheerio'),
	moment = require('moment'),
	fs = require('fs'),
	headers = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'],
	url_options = {
		uri: 'http://restaurangedison.se/lunch'
	},
	weekInfo = {};


function parseLunches(body) {
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

module.exports = {
	getLunches: function(callback) {

		if (process.env.DEBUG) {
			console.log('DEBUG MODE, getting data from local file');
			fs.readFile('edisonlunch.html', function(err, data) {
				var body = data.toString();

				// Cache the weeklyInfo
				var week = moment().week();
				if (weekInfo[week] === undefined) {
					var weeklyInfo = parseLunches(body);
					weekInfo[week] = weeklyInfo;
				}

				callback(null, weekInfo[week]);
			});	
		}
		else {
			request(url_options, function (error, response, body) {
				console.log('Getting data from remote server');
				// Cache the weeklyInfo
				var week = moment().week();
				if (weekInfo[week] === undefined) {
					var weeklyInfo = parseLunches(body);
					weekInfo[week] = weeklyInfo;
				}

				callback(null, weekInfo[week]);
			});
		}
	}
};
