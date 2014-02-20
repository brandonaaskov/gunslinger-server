"use strict"
module.exports = (grunt) ->
  grunt.initConfig
    watch:
      options:
        debounceDelay: 500

      tools:
        files: [
          '*.coffee',
          '*.json'
        ]

      scripts:
        files: ['scripts/**/*.coffee']

    coffee:
      tools:
        expand: true
        cwd: './'
        src: ['**.coffee']
        dest: ''
        ext: '.js'

      server:
        expand: true
        cwd: 'scripts'
        src: ['**/*.coffee']
        dest: 'scripts'
        ext: '.js'

    shell:
      clientTest:
        options:
          stdout: true
        command: 'npm test'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-shell'
  grunt.registerTask 'build', ['coffee']
  grunt.registerTask 'test', ['shell:clientTest']
  grunt.registerTask 'default', ['build', 'test']