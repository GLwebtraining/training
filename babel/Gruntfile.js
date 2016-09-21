module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.initConfig({
	    babel: {
	        options: {
	            sourceMap: true,
	            presets: ['es2015']
	        },
	        dist: {
	            files: {
	                'dist/app.js': 'src/app.js'
	            }
	        }
	    },
		watch: {
			scripts: {
				files: 'src/*.js',
				tasks: ['babel']
			},
		},
	});

	grunt.registerTask('default', ['babel']);
};