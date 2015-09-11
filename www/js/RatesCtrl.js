angular.module('cdr.RatesCtrl', [])

.controller('RatesCtrl', function($scope){

	// object variable for update rates page
	$scope.rates = {};
	// bolean variable created bcus to makesure the data only been retrive once when user enter the page - not everytime
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
		console.log("after update: " + bol);
	}

	// This is obj arr created to store all data that been retrieved from data base - to store data temporaryly if user add currency
	$scope.arr = [];
	console.log("bfore load: " + bol);
	if(bol === false){
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
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		})
		bol = true;
	}else{	}

	console.log("after load: " + bol);


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
	
})
