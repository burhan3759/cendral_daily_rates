angular.module('cdr.rates', [])

.controller('ratesCtrl',function($scope, $state, $window, $ionicSideMenuDelegate){
	
	$scope.toggleLeft = function() {
    	$ionicSideMenuDelegate.toggleLeft();
  	};
	
	$scope.goUpdate = function(){
		$state.go('editRates');
	};
	
	
	$scope.name = {};

	$scope.submit = function(){
		console.log("First Name: " + $scope.name.first + "\n" +
		"last Name: " + $scope.name.last);
		$scope.hi = "Hi " + $scope.name.first + "!";
		// $scope.name.first = '';
		$window.localStorage['name'] = JSON.stringify($scope.name);
	};
});