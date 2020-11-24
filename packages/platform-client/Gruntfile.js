// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    },
    mochaTest: {
      integration: {
        options: {
          reporter: 'spec'
        },
        src: ['test/integration/*.js']
      },
      unit: {
        options: {
          reporter: 'spec'
        },
        src: ['test/unit/*.js']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['test']);
  // Standard tasks
  grunt.registerTask('unit-test', ['mochaTest:unit']);
  grunt.registerTask('test', ['mochaTest:integration','mochaTest:unit']);
};
