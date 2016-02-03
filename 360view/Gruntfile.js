module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {      
        mangle: false,
        compress: false
      },
      build: {
        files: {
          'app/release/vendors.min.js': [
			'app/components/jquery/dist/jquery.js', 
			'app/components/angular/angular.js', 
			'app/components/angular-file-upload/dist/angular-file-upload.js'
		  ],
          'app/release/scripts.min.js': ['app/scripts/**/*.js']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'app/styles',
          src: ['*.css', '!*.min.css'],
          dest: 'app/release',
          ext: '.min.css'
        }]
      }
    },
    sass: {
        dist: {
          files: {
          'app/styles/styles.css': [ // в эту папку получиться скомпелированный и сконкатенированный css файл готовый для продакшена
              'app/styles/styles.scss' // и этого
            ]
          }
        }
    },
    watch: {
      css: {
        files: '**/*.scss', // следить за изменениями любых файлов с разширениями .scss
        tasks: ['sass', 'cssmin'] // и запускать такую задачу при их изменении
      },
      uglify:{
        files: 'app/release/scripts.min.js',
	      task: ['build']
      }
    }
 
  });
 
  //погружаем все необходимые модули
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');    
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
 
  //забиваем в задачу по умолчению все наши задачи
  grunt.registerTask('default', ['uglify', 'cssmin', 'sass', 'cssmin', 'watch']);
};