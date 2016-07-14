 angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal, $filter, $cordovaDialogs, $window, ModalService, $ionicLoading, LoadingService, $ionicHistory){


	$scope.load = function(){
		LoadingService
		.load($scope);
	}

	$scope.GoBack = function() {
	    $ionicHistory.goBack();
  	};

	//close the modal from controller :since close the modal at Html can be done by directly call the function in services.js
	$scope.close = function(){
		ModalService
	      .mod('', $scope)
	      .catch($scope.closeModal())		
	}


// This is obj arr created to store all data that been retrieved from data base - to store data temporaryly if user add currency
	$scope.arr = [];
	$scope.arrs = [];
	$scope.updt = [];
	var counter = 0;
	$scope.getRate = function(type){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		  	$scope.length = results.length;
		    for (var i = 0; i < results.length; i++) {
		    	var Updt = results[i].get('updatedAt');
		    	if(type == 'rate'){
		    		console.log("run");
			    	var data = results[i].get('currency');
		
				    $scope.arrs.push({
				    	id: results[i].id,
		            	name: data.name,
		            	amount: data.amount,
		            	sell: data.sell,
		            	buy: data.buy,
		            	Updt: Updt
		            })
		            $scope.load();

				} else if (type == 'update'){
					// var Updts = results[i].get('updatedAt');

		            $scope.updt.push({
		            	id: results[i].id,
		            	Updt: Updt
		            })
		        }
		    }
		    // console.log("Sho me: " + $scope.checkUpdt);

		    $scope.check($scope.updt);
		    if(type == 'rate'){	
		    	localStorage.setItem('arr',  JSON.stringify($scope.arrs));
		    	
			}
 
		  },
		  error: function(error) {
		    alert("There is problem occured, Sorry. Please try Again");
		  }
		})
		
	}
	
	$scope.arr = JSON.parse(localStorage['arr'] || '[]');

// object variable for update rates page
	$scope.rates = {};
	// $scope.getRate();

//refresh the page
	$scope.refresh = function(){
		$window.location.reload(true);
	}

	$scope.clearLS = function (){
		// $window.localStorage.clear();
		localStorage.removeItem('arr');
		console.log("Clear LS pressed");
	}



//this id is dynamic, will change everytime we add new currency
	var getID;	
	$scope.save = function(){
		var Rates = new Parse.Object.extend("Rates");
		var rates = new Rates();
		rates.set("currency", $scope.rates);
		 
		rates.save(null, {
			success: function(rates) {
				// Execute any logic that should take place after the object is saved.
	 			console.log('New object created with objectId: ' + rates.id);
	 			getID = rates.id;
	 			bol = false;
			},
			error: function(rates, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to create new object, with error code: ' + error.message);
			}
		});
	}
	

//function for update the rates accrodingly
	$scope.updateRates = function(data){
		console.log("updateRates: id: " + data.id + " amount" + data.amount);
		$scope.update = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var update_Rates = Parse.Object.extend("Rates");
		var update_rates = new Parse.Query(update_Rates);
		update_rates.equalTo("objectId",data.id);
		update_rates.first({
		  success: function(results) {
		    results.set("currency", $scope.update);
		    results.save();
		    console.log("Update Success");
			// $scope.refresh();
		  },
		  error: function(error) {
		    alert('Currently cannot update the rates. Sorry, Please try in a moment');
		  }
		})
		alert('Currency Updated');
		// $scope.close();
	}

// function to add currency it will add inside and array - to save in database function is been implemented on html page it self
	$scope.add_rate = {};	//object for put the value of new currency
	$scope.addCurrency = function(data){
		console.log($scope.add_rate);
		data = $scope.add_rate;
		$scope.new_Currency = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var add_currency = new Parse.Object.extend("Rates");
		var add = new add_currency();
		add.set("currency", $scope.new_Currency);	 
		add.save(null, {
			success: function(rates) {
	 			console.log('New object created with objectId: ' + rates.id);
				$scope.arr.push({
					id: getID,
					name: data.name,
					amount: data.amount,
					sell: data.sell,
					buy: data.buy
				});
	 			$scope.refresh();
			},
			error: function(rates, error) {
			    // error is a Parse.Error with an error code and message.
			    alert('Failed to Add Currency. Please Try Again');
			}
		});

		// console.log("get the name: " + data.name);
	    $scope.close();
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
				$scope.refresh();
			  },
			  error: function(object, error) {
				// The object was not retrieved successfully.
				alert('Failed to Delete Currency. Please Try Again');
			  }
			})
          	}
          });
	}
		
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


	$scope.check = function(updt){
		var x = false;
		if(counter == 0){
			for(var z=0; z<$scope.arr.length; z++){
			
			var getUpdt = $filter('date')(updt[z].Updt , 'dd/MM/yyyy HH:mm');
			var getDate = $filter('date')($scope.arr[z].Updt , 'dd/MM/yyyy HH:mm');
				
				if(getUpdt > getDate){
					console.log("updated");
					x = true;
				}
			}

			// if(!$scope.loggedIn()){
				if(x == true){
					$scope.clearLS();
					counter++;
					$scope.getRate('rate');
				}
			// }
			
		}
	}
	

	if(!localStorage['arr']){
		$scope.getRate('rate');
		console.log("updted");
	}else{
		$scope.getRate('update');		
	}

})

