var lunchLinks = {
	more: 'https://www.facebook.com/TheMoreBistro',
	grand: 'https://www.facebook.com/GrandOloMat',
	thaibox: 'http://mat24.se/Malmo/Thai-Box',
	indianexpress: 'http://indianexpress.se/extra/dagensmeny',
	spoonery: 'http://spoonery.se/st-knut/',
	texaslonghorn: 'http://www.texaslonghorn.se/restaurant/triangeln/lunch/',
	nois: 'http://nois.nu/Nois_cafe_och_deli.html',
	tusen2: 'http://tusen2.se/onewebmedia/MENY2013%20innersidan.pdf',
	vespa: 'http://molle.vespa.nu/',
	scaniabar: 'http://scaniabar.se/index.php/lunch',
	plockepinn: 'http://www.plockepinn.se/lunch/',
	rebell: 'http://restaurangrebell.se/lunchold/lunch/',
	edison: 'http://restaurangedison.se/lunch'
};

module.exports = {
	getLunchesFromRestaurant: function(restaurant, callback) {
		try {
			var lunchStrategy = require('./'+restaurant);
			lunchStrategy.getLunches(function (err, data) {
				var info = {
					link: lunchLinks[restaurant],
					lunches: data
				};
				callback(null, info);
			});
		}
		catch (e) {
			if (lunchLinks.hasOwnProperty(restaurant)) {
				return callback(null, {
					link: lunchLinks[restaurant]
				});
			}
			return callback("No restaurant strategy with the name "+restaurant+" was found");
		}
	}
};