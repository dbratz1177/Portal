'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'User', function($scope, User) {
		$scope.users = User.query();
		$scope.applicationFilters = {
			approved : true
		};
		$scope.queue = [];
		$scope.notDate = "Nothing Selected!";
		$scope.queueEntrySelected = false;
		$scope.submitQueue = function() {
			//come back to the actual nature of this later...
		};
		$scope.date = function(offset, queueEntry) {
			var date = moment().locale('en').add(offset, 'd').format('MM-DD-YYYY');
			queueEntry.date = date;
		};
		$scope.labelClicked = function(index) {
			$scope.queueEntrySelected = true;
			for (var i = $scope.queue.length - 1; i >= 0; i--) {
				$scope.queue[i].clicked = "not-clicked";
			};
			$scope.queue[index].clicked = "clicked";
			$scope.notDate = $scope.queue[index].date;
			$scope.highlightedIndex = index;
		};
		
		$scope.eligibleUsers = function() {
			if ($scope.queueEntrySelected) {
				var eligible = [];
				var hasAssignedDate = false;
				for (var i = $scope.users.length - 1; i >= 0; i--) {
					if ($scope.isBaselineEligible(i)) {
						for (var j = $scope.users[i].datesAssigned.length - 1; j >= 0; j--) {
							if($scope.users[i].datesAssigned[j].date === $scope.notDate) {
								hasAssignedDate = true;
							};
						};
						if(!hasAssignedDate){
							eligible.push($scope.users[i]);
						};
						hasAssignedDate = false;
					};
				};
				return eligible;
			};
		};
		$scope.isBaselineEligible = function(index) {
			return ($scope.users[index].appStatus === "approved" && 
				!($scope.daUser.id === $scope.users[index].id) &&
				$scope.userIsNotInQueue(index));
		};
		$scope.userIsNotInQueue = function(index) {
			for (var i = $scope.queue.length - 1; i >= 0; i--) {
				if($scope.users[index].id === $scope.queue[i].user.id)
					return false;
			};
			return true;
		};
		$scope.setupSelectedUser = function(daUser) {
			$scope.daUser = daUser;
		};
		$scope.setQueueUser = function(queueEntry) {
			queueEntry.user = {name : "Nobody"};
			if($scope.daUser != null){
				for (var i = $scope.daUser.queue.length - 1; i >= 0; i--) {
					if($scope.daUser.queue[i].date === queueEntry.date){
						queueEntry.user = $scope.getUserFromID($scope.daUser.queue[i].id);
					}
				};
			} else {
				queueEntry.user.name = "Nobody";
			}
		};
		$scope.getUserFromID = function(id) {
			if(id === ""){
				return {name : "Nobody"};
			};
			for (var i = $scope.users.length - 1; i >= 0; i--) {
				if($scope.users[i].id === id){
					return $scope.users[i];
				}
			};
		};
		$scope.setQueueUsers = function() {
			var queue = $scope.queue;
			for (var i = queue.length - 1; i >= 0; i--) {
				$scope.setQueueUser(queue[i]);
			};
		};
		$scope.setQueue = function(queueLength){
			for (var i = queueLength - 1; i >= 0; i--) {
				if ($scope.queue[i] == null) {
					$scope.queue[i] = {
						date : moment().locale('en').add(i, 'd').format('MM-DD-YYYY'),
						user : {name : "Nobody"},
						clicked : "not-clicked"
					};
				};
			};
		};
		$scope.putInQueue = function(user) {
			if($scope.queue[$scope.highlightedIndex].user.name != "Nobody"){
				$scope.deAssignDate();
			}
			$scope.assignDate(user);
			$scope.queue[$scope.highlightedIndex].user = user;
		};
		$scope.removeFromQueue = function(index){
			var oldUser = $scope.queue[index].user;
			$scope.labelClicked(index);
			$scope.queue[index].user = {name: "Nobody"};
			if(oldUser.name != "Nobody"){
				for (var i = $scope.users.length - 1; i >= 0; i--) {
					if($scope.users[i].id === oldUser.id){
						for (var j = $scope.users[i].datesAssigned.length - 1; j >= 0; j--) {
							if($scope.users[i].datesAssigned[j].date === $scope.queue[index].date){
								$scope.users[i].datesAssigned.splice(j,1);
								return;
							}
						};
					}
				};
			}
		};
		$scope.deAssignDate = function() {
			for (var i = $scope.users.length - 1; i >= 0; i--) {
				if($scope.users[i].id === $scope.queue[$scope.highlightedIndex].user.id){
					//should dates **really** be stored as an array? Would be faster/more efficient to query a set...
					for (var j = $scope.users[i].datesAssigned.length - 1; j >= 0; j--) {
						if($scope.users[i].datesAssigned[j].date === $scope.queue[$scope.highlightedIndex].date){
							$scope.users[i].datesAssigned.splice(j, 1);
							return;
						}
					};
				}
			};
		};
		$scope.assignDate = function(user) {
			for (var i = $scope.users.length - 1; i >= 0; i--) {
				if($scope.users[i].id === user.id) {
					$scope.users[i].datesAssigned.push({"date":$scope.queue[$scope.highlightedIndex].date, "id":$scope.daUser.id});
					return;
				}
			};
		};
}]);