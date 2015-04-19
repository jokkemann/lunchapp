module.exports = {
	getLunchesFromRestaurant: function(restaurant, callback) {
		switch(restaurant){
			case 'edison':
				var edisonStrategy = require('./edison');
				edisonStrategy.getLunches(function (err, data) {
					callback(null, data);
				});
				break;
			default:
				return callback("No restaurant strategy with the name "+restaurant+" was found")
				break;
		}
	}
};