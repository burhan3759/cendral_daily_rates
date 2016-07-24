 angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal, $filter, $cordovaDialogs, $window, ModalService, LoadingService, $ionicHistory, $state, $http, $timeout, $stateParams, $interval, $ionicLoading){  

	//function that call loading service 
	$scope.load = function(){
		LoadingService
		.load($scope);
	}

	$scope.progressPercent = 0
	$scope.simulateLoad = function() {
		var interval = setInterval(function() {
				// Increment the value by 1
				$scope.progressPercent++
					if ($scope.progressPercent == 10) {
						// $scope.clearLS();
						$scope.getRate('update');
						// $state.go($state.current, {}, {reload: true}); 
						clearInterval(interval);
						$scope.progressPercent = 0
					}
				$scope.$apply()
		}, 80);
	}

	// $scope.timer = function(){
		$scope.Timer = $interval( function() {
			$scope.getRate('update');
		}, 10000);
		// $scope.timer();
	// }

	//declare scope.arr to store data
	$scope.arr = [];
	$scope.updt = [];

	//get table Rates from database
	var getRates = Parse.Object.extend("Rates");
	var get_rates = new Parse.Query(getRates);

	//get Data from database
	$scope.getRate = function(type){
		get_rates.find({
		  success: function(results) {  	
		  	$scope.length = results.length;
		    for (var i = 0; i < results.length; i++) {
		    	//get updatedAt and currency column from table
	    		var Updt = results[i].get('updatedAt');
		    	var data = results[i].get('currency');		    	
		    	if(type == 'rate'){
				    $scope.arr.push({
				    	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	Updt: Updt
		            })
				} 

				if (type == 'update'){
		            $scope.updt.push({
		            	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	Updt: Updt
		            })
		        }
		    }		   

	    	if(type == 'update'){
	    		$scope.check($scope.arr, $scope.updt);	
	    	} 	
	    	//save the array to localstorage for offline support
	    	localStorage.setItem('arr',  JSON.stringify($scope.arr));
		  },
		  error: function(error) {
		  	alert("No or Slow Internet Connection");
			$scope.arr = JSON.parse(localStorage['arr'] || '{}');	
		  }
		});
	}

	$scope.getRate('rate');

	// $scope.cache = true;

	var counter = 0;
	var x = false;
	$scope.check = function(arr, updt){	
		var index;
		// if(counter == 0){
		if(updt.length > $scope.arr.length){
		    $ionicLoading.show({
		      content: 'Loading',
		      animation: 'fade-in',
		      showBackdrop: true,
		      maxWidth: 200,
		      showDelay: 500
		    });
			arr.splice(updt.length, 1, updt[(updt.length-1)]);
			$timeout(function () {
				$ionicLoading.hide();
			}, 2000);
			// x = true;
		}else if(updt.length < arr.length){
			console.log("updt: " + updt.length + " arr: " + arr.length);
			var get = false;
			var remove;
			var z;
			var y;
			for(z=0; z<arr.length; z++){
				if(get == false){
					for(y=0; y<updt.length; y++){
						if(arr[z].id == updt[y].id){
							get = false;
							y = updt.length;
							console.log("y: "+y);
						}
						else{
							console.log("z: "+z);
							remove = z;
							get = true;

						}
					}
					
				}else if(get == true){
					arr.splice(remove);
					z = arr.length;

				}
			}
			// console.log(get);
			// if(get == true){
			// 	arr.splice(remove);
			// }


		}else{
			for(var z=0; z<updt.length; z++){
				var updtBuy = updt[z].buy;
				var updtSell = updt[z].sell;
				var updtAmount = updt[z].amount;
				var arrBuy = arr[z].buy;
				var arrSell = arr[z].sell;
				var arrAmount = arr[z].amount;
				console.log(updtSell);
				console.log(arrSell);
				if(updtBuy > arrBuy || updtBuy < arrBuy || updtSell > arrSell || updtSell < arrSell || updtAmount > arrAmount || updtAmount < arrAmount){
					// console.log(z + " :" + (z+1));
					// var y = z;
				    $ionicLoading.show({
				      content: 'Loading',
				      animation: 'fade-in',
				      showBackdrop: true,
				      maxWidth: 200,
				      showDelay: 500
				    });

					arr.splice(z, 1, updt[z]);
					// x = true;
					$timeout(function () {
						$ionicLoading.hide();
					}, 2000);
				}
			}
		}
			

			// if(x == true){
			// 	// $scope.arr.splice(0, $scope.arr.length);
			// 	// $scope.clearLS();
			// 	// $scope.getRate('rate');
			// 	// $scope.cache = false;
			// 	// $state.go($state.current, {}, {reload: true}); 
			// 	counter++;
			// }
		
			$scope.updt.splice(0, updt.length);	
		// }
	}

	
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

		    // $scope.getRate();
		    // $state.go($state.current, {}, {reload: true}); 

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

