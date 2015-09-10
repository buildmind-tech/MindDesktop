/**
* MindDesktop.server Module
*
* Description
*/
angular.module('MindDesktop.server', []).
controller('ServerCtrl', ['$scope','$server','$mdDialog',function($scope,$server,$mdDialog){
	$scope.servers=$server.get();

	$scope.check=function($event,$index){
		$mdDialog.show({
	       	targetEvent: $event,
	       	templateUrl: 'templates/server-detail.html',
         	locals: {
           		items: $scope.items
         	},
         	clickOutsideToClose:true,
         	controller: 'ServerDetailController'
		})
	}

}])

.controller('ServerDetailController', ['$scope','$server','$mdDialog',function($scope,$server,$mdDialog){
	// $scope.servers=$server.get();
	$scope.hide=function(){
		$mdDialog.hide()
	}

}])

.factory('$server', ['$rootScope', function($rootScope){
	var self=this;

	var servers=[
		{
			name:'ExpressTemplate',
			framework:'Express',
		}
	]

	var get=function(){
		return servers
	}

	self={
		get:get
	}

	return self;
}])