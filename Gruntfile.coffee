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
      server:
        files: ['app.coffee', 'Gruntfile.coffee', 'scripts/**/*.coffee']
        expand: true
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