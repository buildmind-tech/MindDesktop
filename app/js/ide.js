/**
* MindDesktop.ide Module
*
* Description
*/
angular.module('MindDesktop.ide', [])
.controller('IDECtrl', ['$rootScope','$scope','$http','hotkeys','$ide', function($rootScope,$scope,$http,hotkeys,$ide){

	var element;
	var editor;
	var fontSize=20;

	$scope.code="";
	$scope.tabs=$ide.getTabs();

	$scope.$on('$ide.content',function(ev,data){

		editor.getSession().setMode("ace/mode/" + data.mime.toLowerCase());
		$scope.code=data.content;

		var index=-1;
		
		for (var i=0;i<$scope.tabs.length;i++){
			if ($scope.tabs[i].path==data.path) {
				index=i;
			}
		}
		if ( index==-1) { //新內容
			$scope.tabs.push(data);
			$scope.currentTab=$scope.tabs.length-1;
		}
		else {
			$scope.currentTab=index;
		}		
	})

	$scope.$on('$ide.tabclose',function(ev,path){
		var index;
		for (var i=0;i<$scope.tabs.length;i++){
			if ($scope.tabs[i].path==path) {
				index=i;
			}
		}
		$scope.tabs.splice(index,1);
		$scope.$digest();
	})

	$scope.$on('$view.loaded',function(ev,_element){
		element=_element;
	});

	$scope.aceLoaded=function(_editor){
		editor=_editor;
		_editor.setFontSize(fontSize);
		_editor.commands.addCommand({
		    name: "increase_font",
		    bindKey: {win: "Ctrl-Up", mac: "Command-Up"},
		    exec: function(editor) {
		    	fontSize+=1;
		    	_editor.setFontSize(fontSize);
		    }
		});

		_editor.commands.addCommand({
		    name: "decrease_font",
		    bindKey: {win: "Ctrl-Down", mac: "Command-Down"},
		    exec: function(editor) {
		    	fontSize-=1;
		    	_editor.setFontSize(fontSize);
		    }
		});

		_editor.commands.addCommand({
		    name: "save_file",
		    bindKey: {win: "Ctrl-S", mac: "Command-Down"},
		    exec: function(editor) {
		    	$ide.save($scope.code,$scope.tabs[$scope.currentTab].path)
		    }
		});
	}

	$scope.aceChanged=function(){

	}

}])

.factory('$ide', ['$rootScope','$q', function($rootScope,$q){
	var self = this;
	// var dir = require('node-dir');
  	var fs = require('fs');
  	var tabs=[];
 	

  	var getProjectFiles=function(path){
  		var q=$q.defer();

  		var files=[];
  		fs.readdir(path, function(err, items) {	 
		    for (var i=0; i<items.length; i++) {
		        var file=fs.statSync(path+"/"+items[i]);
		        if (file.isDirectory()) {
		        	files.push({
		        		type:'dir',
		        		name:items[i],
		        		sub:[],
		        		path:path+"/"+items[i]
		        	})
		        }
		        else {
		        	files.push({
		        		type:'file',
		        		name:items[i],
		        		path:path+"/"+items[i]
		        	});
		        }
		    }
		    q.resolve(files)
		});



		

  		return q.promise;
  	}

  	var getFile=function(path,name){
		var q=$q.defer();
		fs.readFile(path, 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  var mime = require('mime');
		  var file_mime=mime.lookup(path); 

		  if (file_mime.indexOf('javascript')!=-1){
		  	file_mime='javascript'
		  }

		  if (file_mime.indexOf('html')!=-1){
		  	file_mime='html'
		  }

		  if (file_mime.indexOf('json')!=-1){
		  	file_mime='json'
		  }

		  if (file_mime.indexOf('markdown')!=-1){
		  	file_mime='markdown'
		  }

		  if (file_mime.indexOf('css')!=-1){
		  	file_mime='css'
		  }

		  q.resolve({
		  	mime:file_mime,
		  	content:data,
		  	path:path,
		  	name:name
		  })
		});

		return q.promise;
	}

	var getTabs=function(){
		return tabs;
	}

	var save=function(content,path){
		fs.writeFile(path, content, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The file was saved!");
		}); 
	}

	self={
		getProjectFiles:getProjectFiles,
		getFile:getFile,
		getTabs:getTabs,
		save:save,
	}

	return self;
}])

.directive('ideFolder', ['$compile','$ide', function($compile,$ide){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		replace:true,
		scope:{
			path:'@path',
			name:'@name',
			type:'@type'
		},
		template:"<div class=''><section class='mind-desktop-ide-section'></section></div>",
		link: function(scope,element,attrs) {

			var fs = require('fs');


			element.css('paddingLeft','20px');
			// element.css('height','18px');
			
			element.css('position','relative');

			var section=element.children();

			section.html(scope.name);

			if (!scope.type || scope.type=="dir"){
				scope.open=false;
				scope.sub=[];

				var containerTpl="<div></div>";
				var container=$compile(containerTpl)(scope);
				// container.css('webkitTransition','all 0.5s ease');
				// container.css('overflow','hidden')
				element.append(container);

				section.addClass('ion-ios-arrow-right');
				section.bind('click',function(){
					if (!scope.open) {
						section.addClass('open')
						if (!scope.sub || scope.sub.length==0) {
							$ide.getProjectFiles(scope.path).then(function(files){
								scope.sub=files;
								files.forEach(function(item){
									var newItemTpl="<ide-folder name='"+item.name+"' path='"+ item.path +"' type='" + item.type +"'></ide-folder>"
									var newItem=$compile(newItemTpl)(scope);
									container.append(newItem);
								});
								container.css('height','auto')
								// container.css('height',scope.sub.length*18+'px')	
								container.css('lineHeight','18px');
								container.css('visibility','visible');
							})
						}
						else {
							container.css('height','auto')
							// container.css('height',scope.sub.length*18+'px')
							container.css('lineHeight','18px');
							container.css('visibility','visible');		
						}	

						
														
					}
					else {
						section.removeClass('open')

						container.css('height','0px')
						container.css('lineHeight','0px');
						container.css('visibility','hidden');
					}
					
					scope.open=!scope.open;
				})
			}
			else {

				// var coverTpl="<div></div>";
				// var cover=$compile(coverTpl)(scope);

				// cover.css('width','400px')

				// cover.css('position','absolute')
				// cover.css('top','0');
				// cover.css('left','-200px')

				section.bind('click',function(){
					console.log('I am going to open!')
					$ide.getFile(scope.path,scope.name).then(function(file){
						scope.$emit('$ide.content',file);
					})
				})
			}
			

			// $ide.getProjectFiles()
		}
	};
}])

.directive('ideTabs', ['$compile', function($compile){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope,element,attrs) {
			element.css('width',(window.innerWidth-200)+'px')
			element.css('height','30px');
			element.css('position','absolute');
			element.css('top','70px');
			element.css('textAlign','left');
			element.css('display','flex');
		}
	};
}])

.directive('ideTab', ['$compile','$ide', function($compile,$ide){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope,element,attrs) {
			element.addClass('ide-file-tab')
			// element.css('height','30px');
			// element.css('maxWidth','250px');

			// element.css('lineHeight','30px');
			// element.css('display','inline-block');
			// element.css('flex','1');
			// element.css('overflow','hidden');
			// element.css('textOverflow','ellipsis');

			// element.css('background','grey');
			// element.css('padding','0 10px');
			// element.css('margin','0');
			// element.css('fontSize','12px');

			// element.css('position','relative');


			var closeIconTpl="<i class='ion-close'></i>";
			var closeIcon=$compile(closeIconTpl)(scope);
			closeIcon.css('position','absolute');
			closeIcon.css('top','0px');
			closeIcon.css('right','10px');
			closeIcon.css('fontSize','12px');

			closeIcon.bind('click',function(event){
				event.stopPropagation();
				scope.$emit('$ide.tabclose',scope.tab.path)
			})

			element.append(closeIcon);

			element.bind('click',function(event){
				$ide.getFile(scope.tab.path,scope.tab.name).then(function(file){
					scope.$emit('$ide.content',file);
				})
			})
			// height: 30px;
			// max-width: 250px;
			// line-height: 30px;
			// display: inline-block;
			// flex: 1;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// border-radius: 5px;
			// background: grey;
			// padding: 0 10px;
			// margin: 0 5px;
			// font-size: 12px;
		}
	};
}]);