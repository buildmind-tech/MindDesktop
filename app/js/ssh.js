/**
* MindDesktop.ssh Module

*
* Description
*/
angular.module('MindDesktop.ssh', [])

.run(function($rootScope,$sce){
	// var AnsiParser = require("ansi-parser");
	// var Client = require('ssh2').Client;
	// var conn = new Client();
	// var last_command;
	// conn.on('ready', function() {
	//   console.log('Client :: ready');
	//   conn.shell(function(err, stream) {
	//     if (err) throw err;
	//     stream.on('close', function() {
	//       console.log('Stream :: close');
	//       conn.end();
	//     }).on('data', function(data) {
	//       data_string=data.toString('utf8');

	//       if (last_command && data_string.indexOf(last_command)==0) {
	//       	if (last_command==data_string) {
	// 	       return;
	// 	  	}
	// 	  	else {
	// 	  		data_string=data_string.split('\n')[1];
	// 	  	}
	// 	  	last_command=null;
	//       }

	//       // // wipe out the first
	//       // if (data_string.indexOf('[0m')==0){
	//       // 	data_string=data_string.replace("[0m","")
	//       // }      
	//       // // wipe oh my zsh
	//       // data_string=data_string.replace("[00m[K[?1h=","");

	//       // // get rid of start
	//       // data_string=data_string.replace(/\[01;32m/g, "<span style='color:rgb(85,255,85)'>");
	//       // data_string=data_string.replace(/\[01;34m/g, "<span style='color:rgb(85,85,255)'>");
	//       // data_string=data_string.replace(/\[01;36m/g, "<span style='color:rgb(85,255,255)'>");
	      
	//       // data_string=data_string.replace(/\[30;42m/g, "<span style='background:rgb(0,187,0);color:black'>");
	//       // data_string=data_string.replace(/\[37;41m/g, "<span style='background:rgb(187,0,0);color:rgb(187,187,187)'>");


	//       // data_string=data_string.replace(/\[32m/g, "<span style='color:rgb(0,187,0)'>");
	//       // data_string=data_string.replace(/\[33m/g, "<span style='color:rgb(187,187,0)'>");
	//       // data_string=data_string.replace(/\[35m/g, "<span style='color:rgb(187,0,187)'>");
	//       // data_string=data_string.replace(/\[37m/g, "<span style='color:white'>");
	//       // data_string=data_string.replace(/\[90m/g, "<span style='color:rgb(48,73,60)'>");


	//       // //get rid of end
	//       // data_string=data_string.replace(/\[0m/g,"</span>")
	//       // data_string=data_string.replace(/\[39m/g,"</span>")

	//       console.log(data_string);
	      

	//       data_string=AnsiParser.removeAnsi(data_string);

	      
	//       if (data_string.indexOf('#')==0) {
	//       	return;
	//       }

	//       if (data_string.indexOf("\[\?1l\>")!=-1) {
	//       	return;
	//       }

	//       data_string=data_string.replace("[K[?1h=","");
	//       // data_string=$sce.trustAsHtml(data_string);

	//       console.log(data_string);

	//       $rootScope.$broadcast('ssh:output',data_string);
	//       $rootScope.$digest();


	      
	//     }).stderr.on('data', function(data) {
	//       console.log('STDERR: ' + data);
	//     });

	//     $rootScope.$on('ssh:input',function(ev,input){
	//     	last_command=input;
	//   		stream.write(input+'\n');	  		
	//   	})


	//   });


	// }).connect({
	//   host: '106.184.6.131',
	//   port: 22,
	//   username: 'root',
	//   password: 'build88mind'
	// });
})

.directive('ssh', ['$rootScope','$sce', function($rootScope,$sce){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'templates/ssh.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, element, attrs, controller) {

			scope.items=[];

			$rootScope.$on('ssh:output',function(event,output){

				console.log("[K[?1h=");
				console.log(output.indexOf("[K[?1h="));

				scope.items.push(output);
				var scroll=element.find('md-virtual-repeat-container').children()[0];
				scroll.scrollTop = scroll.scrollHeight;
				// element.append('<p style="white">'+output+'</p>')
			})

			element.bind('keydown',function(e){
				if (e.keyCode==13){
					scope.items[scope.items.length-1]+=scope.input;
					$rootScope.$broadcast('ssh:input',scope.input);
					scope.input="";
					$rootScope.$digest();
				}
			})

			scope.trustAsHtml=function(input){
				return $sce.trustAsHtml(input);
			}
		}
	};
}])

// .filter('shellTrust',function($sce){
// 	return function(input) {
// 		return $sce.trustAsHtml(input)
// 	}
// })