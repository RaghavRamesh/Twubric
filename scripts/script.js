angular.module('Twubric', [])
	.controller('TwubricController', ['$scope', '$http', function($scope, $http) {
		$http.get('values.json')
			.success(function(data) {
				$scope.values = data;
			});

	}]);