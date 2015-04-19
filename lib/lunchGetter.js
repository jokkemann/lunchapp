module.exports = {
	getLunchesFromRestaurant: function(restaurant, callback) {
		try {
			var lunchStrategy = require('./'+restaurant);
			lunchStrategy.getLunches(function (err, data) {
				callback(null, data);
			});
		}
		catch (e) {
			return callback("No restaurant strategy with the name "+restaurant+" was found");
		}
	}
};