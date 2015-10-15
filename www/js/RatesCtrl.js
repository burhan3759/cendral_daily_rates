angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope, $ionicModal){

	// object variable for update rates page
	$scope.rates = {};
	// bolean variable created bcus to make sure the data only been retrive once when user enter the page - not everytime : this bool is not
	// in used anymore, change it with localstorage
	var bol = false;

	//this id is dynamic will change everytime we add new currency
	var getID;	
	$scope.save = function(){
		console.log("Save function");
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

	$scope.updateRates = function(data){
		console.log("updateRates: id: " + data.id);
		$scope.update = {'name': data.name, 'amount':data.amount, 'sell':data.sell, 'buy':data.buy};
		var update_Rates = Parse.Object.extend("Rates");
		var update_rates = new Parse.Query(update_Rates);
		update_rates.equalTo("objectId",data.id);
		update_rates.first({
		  success: function(results) {
		    // console.log("Successfully retrieved " + results.length);
		    // alert("Successfully retrieved " + results.length);
		    // Do something with the returned Parse.Object values
		    results.set("currency", $scope.update);
		    results.save();
		    console.log("saved");

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		data.edit = false;
		bol = false;
	}

	// This is obj arr created to store all data that been retrieved from data base - to store data temporaryly if user add currency
	$scope.arr = [];
	// if(bol === false){
	if(localStorage['arr']){
		var getRates = Parse.Object.extend("Rates");
		var get_rates = new Parse.Query(getRates);
		get_rates.find({
		  success: function(results) {
		    // console.log("Successfully retrieved " + results.length);
		    // alert("Successfully retrieved " + results.length);
		    // Do something with the returned Parse.Object values

		    for (var i = 0; i < results.length; i++) {
		    	var data = results[i].get('currency');
			    $scope.arr.push({
			    	id: results[i].id,
	            	name: data.name,
	            	amount: data.amount,
	            	sell: data.sell,
	            	buy: data.buy
	            });
		      // alert(object.id + ' - ' + object.get('currency').name + "\n");
		      // console.log(results[i].id);
		    }
		    localStorage['arr'] = JSON.stringify($scope.arr);
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		bol = true;
	}else{	}

	// if no changes but accidently press update rates - currently unnessecary
	// $scope.cancel = function(data){
	// 	data.edit = false;
	// 	bol = false;
	// }


	// function to add currency it will add inside and array - to save in database function is been implement on html page it self
	$scope.addCurrency = function(data){
		console.log("get the name: " + data.name);
		$scope.arr.push({
			id: getID,
        	name: data.name,
        	amount: data.amount,
        	sell: data.sell,
        	buy: data.buy
	    });
		$scope.rates.name = "";
		$scope.rates.amount = "";
		$scope.rates.sell = "";
		$scope.rates.buy = "";
	}

	$scope.editRates = function(data){
		data.edit = true;
	}

	//this function is to convert currency from A to B and B to A
	$scope.currency_conveter = function(){

	}

	$ionicModal.fromTemplateUrl('templates/currency_converter.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(rate) {
		$scope.modal.show();
		$scope.convert_rate = rate;
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	}
	
})
