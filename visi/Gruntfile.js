module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/public/styles',
                    src: ['*.scss'],
                    dest: 'app/public/styles',
                    ext: '.css'
                }]
            }
        },
        watch: {
	    css: {
        	files: 'app/public/styles/*.scss',
	        tasks: ['sass']
	    }
        }
  });
 
  //погружаем все необходимые модули
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');    
 
  //забиваем в задачу по умолчению все наши задачи
  grunt.registerTask('default', ['sass', 'watch']);
};