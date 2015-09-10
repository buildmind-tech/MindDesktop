var fs=require('fs');
var ipc = require('ipc');
var mime = require('mime');
var ws = require('windows-shortcuts');
var lnk=require('lnk-parser');

var desktop_path=process.env.USERPROFILE+'\\Desktop';
var desktop_filenames=[];
var desktop_files=[];

desktop_filenames=fs.readdirSync(desktop_path);
desktop_filenames.forEach(function(file){
	var file_path=desktop_path+'\\'+file
	var _file=fs.statSync(file_path);
	_file.type=_file.isFile() ? "file" : "directory";
	_file.name=file;
	_file.mime=mime.lookup(file_path);

	if (_file.mime=="application/x-ms-shortcut") {
		// ws.query(file_path, function(err,option){
		// 	_file.shortcut=option
		// });
		lnk.check(file_path,function(err,shortcut){
			_file.shortcut=shortcut;
		})
		_file.type="link";
	}

	desktop_files.push(_file);
})

var getFiles=function(){
	return desktop_files;
}

var desktop={
	getFiles:getFiles
};

module.exports=desktop;