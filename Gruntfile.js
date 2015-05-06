'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		jscs: {
			src: [
				'examples/**/*.js',
				'lib/**/*.js',
				'test/**/*.js',
				'Gruntfile.js'
			],
			options: {
				config: 'rules/.jscsrc'
			}
		},
		jshint: {
			src: '<%= jscs.src %>',
			options: {
				jshintrc: 'rules/.jshintrc-server',
			}
		}
	});

	// load all plugins
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['jscs', 'jshint']);
};
