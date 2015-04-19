angular.module('luncheon', []).
controller('LunchCtrl', function($scope, $http) {
	//getLunches('plockepinn');
	$scope.lunchItems = {};
	$scope.isArray = function (v) {
		if (!Array.isArray){
			Array.isArray = function(arg) {
				return Object.prototype.toString.call(arg) === '[object Array]';
			};
		}

		return Array.isArray(v);
	};

	$scope.getLunches = getLunches;

	function getLunches(restaurant) {
		$http.get('get_lunches', { params: {restaurant: restaurant} }).success(function (it) {
			$scope.lunchItems = it;
		});
	}
});