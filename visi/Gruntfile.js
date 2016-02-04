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
 
  //��������� ��� ����������� ������
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');    
 
  //�������� � ������ �� ��������� ��� ���� ������
  grunt.registerTask('default', ['sass', 'watch']);
};