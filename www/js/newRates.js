angular.module('cdr.editRates', [])

.controller('editRatesCtrl',function($scope, $window){

	$scope.name = JSON.parse($window.localStorage['name'] || '{}'); 

})