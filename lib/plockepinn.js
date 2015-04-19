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
		uri: 'http://www.plockepinn.se/lunch'
	},
	weekInfo = {};


function parseLunches(body) {
	var weeklyInfo = [],
		$ = cheerio.load(body),
		days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
		$dayDivs = $('article div.entry-content');

	days.forEach(function(e, i) {
		dayInfo = [];
		var $day = $dayDivs.eq(i);
		var $lunches = $day.find('p');
		$lunches.each(function(i, e) {
			dayInfo.push({
				type: "Alt. "+(i+1),
				food: $(e).text()
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
			fs.readFile('plockepinn.html', function(err, data) {
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
