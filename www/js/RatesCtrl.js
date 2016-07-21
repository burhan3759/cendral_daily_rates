 angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal, $filter, $cordovaDialogs, $window, ModalService, LoadingService, $ionicHistory, $state, $http, $timeout){  

	//function that call loading service 
	$scope.load = function(){
		LoadingService
		.load($scope);
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

	//close the modal from controller :since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
	}


	//scope.arrs to store all data that been retrieved from data base 
	//scope.arr get the data from scope.arr localstorage
	//scope.updt get the updatedAt column value and store it everytime open the app
	//counter is to do checking if the currency is updated or removed or add, the checking will done only once each time the app is open
	$scope.arr = [];
	$scope.arrs = [];
	$scope.updt = [];
	var counter = 0;

	//getRate will get the data from the database accroding to type requested, either updatedAt column or the rates column
	$scope.getRate = function(type){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		  	$scope.length = results.length;
		    for (var i = 0; i < results.length; i++) {
		    	var Updt = results[i].get('updatedAt');
		    	if(type == 'rate'){
			    	var data = results[i].get('currency');
				    $scope.arrs.push({
				    	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	Updt: Updt
		            })


				} else if (type == 'update'){
		            $scope.updt.push({
		            	id: results[i].id,
		            	Updt: Updt
		            })
		        }
		    }

		    $scope.check($scope.updt);

		    //if type is rate it wil store the data into a locastorage 
		    //scpe.load will load the page - not real time load
		    if(type == 'rate'){	
		    	localStorage.setItem('arr',  JSON.stringify($scope.arrs));
		    	$scope.refresh();
		    	// $scope.load();
			}
 
		  },
		  error: function(error) {
		    alert("No/Slow Internet Connection - This is not the latest Rate");
		  }
		})
		//store the data from database at localStorage
		
	}
	
	$scope.arr = JSON.parse(localStorage['arr'] || '[]');	

	//refresh the page
	$scope.refresh = function(){
		$window.location.reload(true);
	}

	$scope.clearLS = function (){
		// $window.localStorage.clear();
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
					id: rates.id,
					name: data.name,
					amount: data.amount,
					sell: data.sell,
					buy: data.buy,
					Updt: Date()
				});
	 			$scope.GoBack();
	    		$scope.refresh();
	 			alert('Successfully add New Currency');
			},
			error: function(rates, error) {
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to Add Currency. Please Try Again');
			}
		});
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
				// $scope.refresh();
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

	$scope.check = function(updt){
		var x = false;
		if(counter == 0){
			for(var z=0; z<updt.length; z++){
				
				if(updt.length < $scope.arr.length || updt.length > $scope.arr.length){
					x = true;
				}else{
					var getUpdt = $filter('date')(updt[z].Updt , 'dd/MM/yyyy HH:mm');
					var getDate = $filter('date')($scope.arr[z].Updt , 'dd/MM/yyyy HH:mm');
					if(getUpdt > getDate){
						x = true;
					}
				}
			}

			if(x == true){
				$scope.clearLS();
				counter++;
				$scope.getRate('rate');
			}
			
		}
	}
	

	if(!localStorage['arr']){
		$scope.getRate('rate');
		// serviceName.getRate('rate');
	}else{
		// serviceName.getRate('update');	
		$scope.getRate('update');
	}

})

