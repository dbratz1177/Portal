'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'User',
	function($scope, User) {
		$scope.users = User.query();
		$scope.applicationFilters = {
			unprocessed : true,
			waitlisted : false,
			approved : false
		};
		$scope.approve = function() {
			//remove user from users - or, maybe just change the daUser's aspect
			//make daUser user[0]
			$scope.daUser.appStatus = "approved";
			//send to backend
		};
		$scope.putOnWaitlist = function() {
			$scope.daUser.appStatus = "waitlisted";
			//need to make sure that if it was already waitlisted, that it doesn't just stay at the top
		};
		$scope.getReferredByName = function(id) {
			if(id === ""){
				return "Nobody";
			};
			for (var i = $scope.users.length - 1; i >= 0; i--) {
				if($scope.users[i].id === id){
					return $scope.users[i].name;
				}
			};
		};
}]);