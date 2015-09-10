/**
* MindDesktop.tabs Module
*
* Description
*/
angular.module('MindDesktop.tabs', []).
factory('$tabs', function(){
	var self=this;
	var tabs=[{
		name:'Desktop',
	},{
		name:'Servers',
	},{
		name:'IDE',
	},{
		name:'MongoDB',
	},{
		name:'Drop',
	}]

	var get=function(){
		return tabs;
	}

	self={
		get:get
	}

	return self;
})


.directive('desktopTabsBodyContainer', ['$rootScope', function($rootScope){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// templateUrl: '',
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		// scope:{
		// 	tabs:"=tabs",
		// 	slides:"=slides",
		// },
		link: function(scope, element, attrs, controller) {
			element.css('width',element.children().length*100+"%");
			element.css('height','100%');
			element.css('position','absolute');
			element.css('top','0');
			element.css('left','0');

			element.css('webkitTransition','all 0.5s ease');
			element.css('webkitTransform','translate(0,0)');

			scope.$watch(function(scope){
				return scope.slides;
			},function(newValue, oldValue){
				element.css('webkitTransform','translate(-'+ newValue*window.innerWidth+'px,0)')
			})
		}
	};
}])

.directive('desktopTabsBody', ['$rootScope','$http','$compile', function($rootScope,$http,$compile){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: '^desktopTabsBodyContainer', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		replace:true,
		template: '<div></div>',
		// transclude: true,
		link: function(scope, element, attrs, controller) {

			if (attrs.templateUrl){
				$http.get(attrs.templateUrl).success(function(html){
					element.append($compile(html)(scope));
					scope.$broadcast('$view.loaded',element);
				})
			}

			element.css('width',window.innerWidth+'px')
			element.css('height','100%');
			element.css('float','left');
			// element.css('display','inline-block');
			element.css('border','1px solid white');
		}
	};
}]);