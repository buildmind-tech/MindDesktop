var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // var desktop=require('./modules/desktop.js');

  var atomScreen = require('screen');
  var size = atomScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  console.log(size);

  mainWindow = new BrowserWindow({
    width: size.width, 
    height: size.height,
    x:0,
    y:0,

    resizable:false,
    frame: false,
    transparent:true,
    "use-content-size":true,

    center:false,
    show:false,



    // "skip-taskbar":true,
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  mainWindow.openDevTools();

  setTimeout(function(){
    mainWindow.show();
  },1500)
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // ipc.on('window:fullsize', function(event, arg) {
  //   console.log(arg);  // prints "ping"
  //   // mainWindow.hide();
  //   mainWindow.setContentSize(size.width,size.height+50);
  //   // mainWindow.setBounds({
  //   //   width: size.width, 
  //   //   height: size.height+50,
  //   //   x:0,
  //   //   y:-50,
  //   // })
  //   // mainWindow.showInactive();
  // });

  // ipc.on('window:normalsize', function(event, arg) {
  //   console.log(arg);  // prints "ping"
  //   mainWindow.setSize(size.width,85)
  // });


});