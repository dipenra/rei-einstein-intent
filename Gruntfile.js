module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  sass: {
		dist: {
			options: {
				sourcemap: 'none',
			},
			files: [{
				expand: true,
				cwd: 'static/scss',
				src: ['*.scss'],
				dest: 'public/css',
				ext: '.css'
			}]
		}
	  }
	});
  
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-sass');
  
	// Default task(s).
	grunt.registerTask('default', ['sass']);
  
  };