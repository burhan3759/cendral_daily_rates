angular.module('cdr.AboutCtrl', [])

.controller('AboutCtrl', function($scope){
	
	// Call using button instead of link
	$scope.call = function(number){
		console.log(number);
		window.location.href = 'tel:' + number;
	};    

})