module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	  	clean: {
			all: ['public/css/', 'public/js/']
		},
		jshint: {
			all: ['Gruntfile.js', 'public/js/*.js']
		},
		sass: {
			all: {
				options: {
					sourcemap: 'none',
				},
				files: [{
					expand: true,
					cwd: 'public/scss',
					src: ['*.scss'],
					dest: 'public/css',
					ext: '.css'
				}]
			}
	  	},
		cssmin: {
			all: {
				files: [{
					expand: true,
					cwd: 'public/css',
					src: ['*.css', '!*.min.css'],
					dest: 'public/css',
					ext: '.min.css'
				}]
			}
		},
		uglify: {
			all: {
				files: [{
					expand: true,
					src: ['public/js/*.js'],
					dest: 'public/',
					cwd: '.',
					rename: function (dst, src) {
						var file = src.replace('public/', '');
						return dst + '/' + file.replace('.js', '.min.js');
					}
				}]
			}
		},
		watch: {
			all: {
				files: ['public/scss/*.scss', 'public/js/*.js'],
				tasks: ['default']
			}
		}
	});
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	// Default task(s).
	grunt.registerTask('default', ['jshint','sass']);
  
  };