angular.module('cdr.AboutCtrl', [])

.controller('AboutCtrl', function($scope, $state){
	
	// Call using button instead of link
	$scope.call = function(number){
		console.log(number);
		window.location.href = 'tel:' + number;
	};    

	$scope.onHold = function(){
		$state.go('SignIn');
	}

})