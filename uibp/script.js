var fs = require('fs');

var settings = {
	folder: {
		styles: 'styles/',
		scripts: 'scripts/',
	},
	file: {
		html: 'index.html',
		styles: 'all.css',
		scripts: 'main.js'
	},
	content: {
		html: '<!doctype html>\n' +
				'<html>\n' +
				'\t<head>\n' +
					'\t\t<title>HTML example</title>\n' +
					'\t\t<link type="text/css" rel="stylesheet" href="all.css" />\n' +
					'\t\t<script type="text/javascript" src="main.js"></script>\n' +
				'\t</head>\n' +
				'\t<body>\n' +
				'\t\t\n' + 
				'\t</body>\n' +
				'</html>',
		css: '',
		js: '(function(){})();'
	},
	callbacks: {
		create: {
			file: function(err){
				if (err) throw err;
				console.log('File saved!');
			},
			folder: function(err){
				if (err) throw err;
				console.log('Folder created!');	
			}
		}
	}
};

fs.mkdir(settings.folder.styles, settings.callbacks.create.folder);
fs.mkdir(settings.folder.scripts, settings.callbacks.create.folder);

fs.writeFile(settings.file.html, settings.content.html, settings.callbacks.create.file);
fs.writeFile(settings.folder.styles + settings.file.styles, settings.content.css, settings.callbacks.create.file);
fs.writeFile(settings.folder.scripts + settings.file.scripts, settings.content.js, settings.callbacks.create.file);