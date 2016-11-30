var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var prefix = 'help > ';

console.log('Hello! It is a front-end helper.');
rl.setPrompt(prefix, prefix.length);
rl.prompt();

rl.on('line', function(line) {
	switch(line.trim()) {
		case 'hello':
			console.log('world!');
			break;
		default:
			console.log('Say what? I might have heard `' + line.trim() + '`');
			break;
	}
	rl.setPrompt(prefix, prefix.length);
	rl.prompt();
});

rl.on('close', function() {
	console.log('Have a great day!');
	process.exit(0);
});
