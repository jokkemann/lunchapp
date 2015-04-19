angular.module('luncheon', []).
controller('LunchCtrl', function($scope, $http) {
	$http.get('get_lunches').success(function(it) {
		$scope.lunchItems = it;
	});
	$scope.isArray = function (v) {
		if (!Array.isArray){
			Array.isArray = function(arg) {
				return Object.prototype.toString.call(arg) === '[object Array]';
			};
		}

		return Array.isArray(v);
	}
});
