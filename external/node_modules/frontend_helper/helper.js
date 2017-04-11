var fs = require('fs');
var settings = {
	folder: {
		css: 'styles',
		js: 'scripts'
	},
	file: {
		html: 'index.html',
		css: 'all.css',
		js: 'main.js'
	},
	content: {
		html: '<!doctype html>\n' +
			'<html>\n' +
				'\t<head>\n' +
					'\t\t<title>Helper</title>\n' +
					'\t\t<link rel="stylesheet" type="text/css" href="styles/all.css"/>\n' +
					'\t\t<script type="text/javascript" src="scripts/main.js"></script>\n' +
				'\t</head>\n' +
				'\t<body>\n' +
				'\t</body>\n' +
			'</html>',
		css: '',
		js: '(function(){})();'
	}
};

fs.mkdir(settings.folder.css);
fs.mkdir(settings.folder.js);
fs.appendFile(settings.folder.css + '/' + settings.file.css, settings.content.css);
fs.appendFile(settings.folder.js + '/' + settings.file.js, settings.content.js);
fs.appendFile(settings.file.html, settings.content.html);
