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
		uri: 'http://material.restaurangguiden.com/skane/malmo/rebell/lunch.aspx?ext=1'
	},
	weekInfo = {};


function parseLunches(body) {
	var weeklyInfo = [],
		$ = cheerio.load(body),
		days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
		$lunchDivs = $('#lunch div.lunchWeek0 div'),
		$weekDishes = $('#lunch div.veckoItem.lunchWeek0 div');

		$lunchDivs.children('strong').remove();

	days.forEach(function(e, i) {
		dayInfo = [];
		var $day = $lunchDivs.eq(i);
		dayInfo.push({
				type: "Dagens",
				food: $day.text().trim()
			});

		$weekDishes.each(function(i, e) {
			var food = $(e).text().trim();
			if (food.length) {
				dayInfo.push({
					type: "Alt. "+(i+1),
					food: food
				});
			}
		});
		// $lunches.each(function(i, e) {
			
		// });

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
			fs.readFile('rebell.html', function(err, data) {
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
