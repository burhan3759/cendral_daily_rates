 angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal, $filter, $cordovaDialogs, $window, ModalService, LoadingService, $ionicHistory, $state, $http, $timeout, $stateParams){  

	//function that call loading service 
	$scope.load = function(){
		LoadingService
		.load($scope);
	}
	//declare scope.arr to store data
	$scope.progressPercent = 0
	$scope.simulateLoad = function() {
		var interval = setInterval(function() {
				// Increment the value by 1
				$scope.progressPercent++
					if ($scope.progressPercent == 1000) {
						$scope.clearLS();
						$scope.getRate();
						$state.go($state.current, {}, {reload: true}); 
						clearInterval(interval);
						$scope.progressPercent = 0
					}
				$scope.$apply()
		}, 80);
	}

	$scope.arr = [];

	//get table Rates from database
	var getRates = Parse.Object.extend("Rates");
	var get_rates = new Parse.Query(getRates);

	//get Data from database
	$scope.getRate = function(){
		get_rates.find({
		  success: function(results) {  	
		  	$scope.length = results.length;
		  	console.log("run get rate");
		    for (var i = 0; i < results.length; i++) {
		    	//get updatedAt and currency column from table
		    	var Updt = results[i].get('updatedAt');
		    	var data = results[i].get('currency');
		    	//store data to array
				    $scope.arr.push({
				    	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	Updt: Updt
		            });
		    }
		    	//save the array to localstorage for offline support
		    	localStorage.setItem('arr',  JSON.stringify($scope.arr));
		  },
		  error: function(error) {
		  	alert("No or Slow Internet Connection");
			$scope.arr = JSON.parse(localStorage['arr'] || '{}');	
		  }
		});
		$scope.simulateLoad();
	}

	$scope.getRate();

	
	//function for go back to previous view
	$scope.GoBack = function() {
	    $ionicHistory.goBack();
  	};

  	// object variable for update rates page
	$scope.rates = {};

	$scope.openRate = function(rate){
		var Url = "";
		if($scope.loggedIn()){
			Url = 'Currency_update.html';
		}else{
			Url = 'currency_converter.html';
		}
		ModalService
		.mod('templates/'+Url, $scope)
		.then(function(modal){
			$scope.rates = rate;
			modal.show();
		});		
	}

	$scope.openAdd = function(getUrl) {
		ModalService
	      .mod('templates/'+getUrl, $scope)
	      .then(function(modal) {
	      	modal.show();	     
	      });		

	      $scope.closePopover();
	};

	//close the modal from controller :since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
	}

	//refresh the page
	$scope.refresh = function(){
		$scope.$broadcast('scroll.refreshComplete');

	}

	$scope.clearLS = function (){
		localStorage.removeItem('arr');
		console.log("Clear LS pressed");
	}

	//function for update the rates 
	$scope.updateRates = function(data){
		$scope.update = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var update_Rates = Parse.Object.extend("Rates");
		var update_rates = new Parse.Query(update_Rates);
		update_rates.equalTo("objectId",data.id);
		update_rates.first({
		  success: function(results) {
		    results.set("currency", $scope.update);
		    results.save();
		    alert('Currency Updated');
		  },
		  error: function(error) {
		    alert('Currently cannot update the rates. Sorry, Please try in a moment');
		  }
		})
		
		//close the modal after update success or failure
		$scope.close();
	}

	//function to add currency it will add inside and array - to save in database function is been implemented on html page it self
	//object for put the value of new currency

	$scope.add_rate = {};	
	$scope.addCurrency = function(data){
		data = $scope.add_rate;
		$scope.new_Currency = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var add_currency = new Parse.Object.extend("Rates");
		var add = new add_currency();
		add.set("currency", $scope.new_Currency);	 
		add.save(null, {
			success: function(rates) {
				$scope.arr.push({
					name: data.name,
					amount: data.amount,
					sell: data.sell,
					buy: data.buy
				});
	 			$scope.GoBack();
	 			alert('Successfully add New Currency');
	 			$scope.progressPercent = 195;
			},
			error: function(rates, error) {
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to Add Currency. Please Try Again');
			}
		})
	}



	$scope.addArr = function(){
		console.log("add");
		// $scope.arr.push({
		// 	name: "nla",
		// 	amount: "1",
		// 	sell: "2",
		// 	buy: "3"
		// });
		// $state.go($state.current, $stateParams, {reload: true, inherit: false});
		// $state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
		// $scope.$broadcast('scroll.refreshComplete');
	}



	//Delete Currency 
	$scope.deleteCurrency = function(data){
		$cordovaDialogs.confirm('Are you sure you want to delete ' + data.name + '?', 'Delete Currency', ['Delete', 'Cancel'])
        .then(function(buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          var btnIndex = buttonIndex;
          if (btnIndex === 1) {
          	var index = $scope.arr.indexOf(data);
			$scope.arr.splice(index, 1);
			var Delete = Parse.Object.extend("Rates");
			var query = new Parse.Query(Delete);
			query.get(data.id, {
			  success: function(myObj) {
			  	$scope.close();
				// The object was retrieved successfully.
				myObj.destroy({});
				// $scope.clearLS();
				alert('Currency in Deleted');
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				alert('Failed to Delete Currency. Please Try Again');
			  }
			})
          	}
          });
	}

})

