module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		sass : {
			dist : {
				files : [{
						expand : true,
						cwd : './styles',
						src : ['*.scss'],
						dest : ['./public/app/styles', './public/login/styles'],
						ext : '.css'
					}
				]
			}
		},
		watch : {
			css : {
				files : 'styles/*.scss',
				tasks : ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['sass', 'watch']);
};