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
          'app/styles/styles.css': [ // � ��� ����� ���������� ���������������� � ������������������ css ���� ������� ��� ����������
              'app/styles/styles.scss' // � �����
            ]
          }
        }
    },
    watch: {
      css: {
        files: '**/*.scss', // ������� �� ����������� ����� ������ � ������������ .scss
        tasks: ['sass', 'cssmin'] // � ��������� ����� ������ ��� �� ���������
      },
      uglify:{
        files: 'app/release/scripts.min.js',
	      task: ['build']
      }
    }
 
  });
 
  //��������� ��� ����������� ������
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');    
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
 
  //�������� � ������ �� ��������� ��� ���� ������
  grunt.registerTask('default', ['uglify', 'cssmin', 'sass', 'cssmin', 'watch']);
};