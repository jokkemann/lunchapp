angular.module('luncheon', []).
controller('LunchCtrl', function($scope, $http) {
	$http.get('get_lunches').success(function(it) {
		$scope.lunchItems = it;
	});
});
