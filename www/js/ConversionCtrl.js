angular.module('cdr.ConversionCtrl', [])

.controller('ConversionCtrl', function(){
//modal for currency converter
	$ionicModal.fromTemplateUrl('templates/currency_converter.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(rate) {
		$scope.unit = 0;
		$scope.sell = 0;
		$scope.modal.show();
		$scope.convert_rate = rate;
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	}

//this function is to convert currency from A to B and B to A
	$scope.typeAS = {};
	$scope.get_type = function(type){
		if(type === "amount"){
			$scope.typeAS.amount = true;
		}else{
			$scope.typeAS.sell = true;
		}
	}
	

	/**
		assign the default value as false to shift
		this function will work like toggle button
		- each time click will swicth true n false accordingly
		- this will show n hide appropriate content
	**/
	$scope.a = true;

	$scope.AtoB = function(total){
		
		if($scope.a === false){
			$scope.unit = total;
			$scope.a = true;
		}else if($scope.a === true){
			$scope.sell = total;
			$scope.a = false;
		}
	}  
})