angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal, $cordovaDialogs, $window){

// This is obj arr created to store all data that been retrieved from data base - to store data temporaryly if user add currency
	$scope.arr = [];
	var bol = false;
	if(bol === false){
// 	if(!localStorage['arr']){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i].get('currency');
			    $scope.arr.push({
			    	id: results[i].id,
	            	name: data.name,
	            	amount: data.amount,
	            	sell: data.sell,
	            	buy: data.buy
	            })
		    }
		    localStorage['arr'] = JSON.stringify($scope.arr);
		  },
		  error: function(error) {
		    alert("There is problem occured, Sorry. Please try Again");
		  }
		})
	}else{	}

// object variable for update rates page
	$scope.rates = {};

//refresh the page
	$scope.refresh = function(){
		$window.location.reload(true);
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
			$scope.refresh();
		  },
		  error: function(error) {
		    alert('Currently cannot update the rates. Sorry, Please try in a moment');
		  }
		})
		$scope.closeCU();
	}
//modal for currency update
	$ionicModal.fromTemplateUrl('templates/Currency_update.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalCU = modal;
	});
	$scope.openCU = function(rate) {
		$scope.modalCU.show();
		$scope.update_rate = rate;
	};
	$scope.closeCU = function() {
		$scope.modalCU.hide();
	}


// function to add currency it will add inside and array - to save in database function is been implemented on html page it self
	$scope.add_rate = {};	//object for put the value of new currency
	$scope.addCurrency = function(data){
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

		console.log("get the name: " + data.name);
// 		$scope.arr.push({
// 			id: getID,
//         	name: data.name,
//         	amount: data.amount,
//         	sell: data.sell,
//         	buy: data.buy
// 	    });
// 	    bol = false;
	    $scope.closeAC();
	}

//modal for add currency 
	$ionicModal.fromTemplateUrl('templates/add_Currency.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalAC = modal;
	});
	$scope.openAC = function() {
		$scope.modalAC.show();
	};
	$scope.closeAC = function() {
		$scope.modalAC.hide();
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
			  	$scope.closeCU();
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
		

//modal for currency converter
	$ionicModal.fromTemplateUrl('templates/currency_converter.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(rate) {
		$scope.unit = rate.unit;
		$scope.sell = rate.sell;
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

