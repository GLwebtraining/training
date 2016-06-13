module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		sass: {
			build: {
				files: {
					'public/app/styles/styles.css': 'styles/app.scss',
					'public/login/styles/styles.css': 'styles/login.scss'
				}
			}
		},
		watch : {
			css : {
				files : 'styles/*.scss',
				tasks : ['default']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['sass:build', 'watch']);
};