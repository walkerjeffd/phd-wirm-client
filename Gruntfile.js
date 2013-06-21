module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
        all: ['src/*.js','src/models/*.js','src/collections/*.js','src/views/*.js','src/routers/*.js'] //files to lint
    },

    clean: ['dist/*'],

    concat: {
      options: {
        banner: '/* ============================================ \n ' +
                '* <%= pkg.name %>.js v<%= pkg.version %> \n ' +
                '* http://walkerjeffd.github.com/wirm/ \n ' +
                '* ============================================= \n ' +
                '* Copyright 2013 Jeffrey D. Walker \n ' +
                '* \n ' +
                '* Build Date: <%= grunt.template.today("yyyy-mm-dd") %> \n ' +
                '* ============================================= */ \n'
      },
      dist: {
        src: ['src/utils.js','src/app.js','src/engine.js','src/chart.js',
              'src/models/*.js','src/collections/*.js','src/views/*.js','src/routers/*.js'], //Using mini match for your scripts to concatenate
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js' //where to output the script
      }
    },

    uglify: {
      options: {
        banner: '/* ============================================ \n ' +
                '* <%= pkg.name %>.js v<%= pkg.version %> \n ' +
                '* http://walkerjeffd.github.com/wirm/ \n ' +
                '* ============================================= \n ' +
                '* Copyright 2013 Jeffrey D. Walker \n ' +
                '* \n ' +
                '* Build Date: <%= grunt.template.today("yyyy-mm-dd") %> \n ' +
                '* ============================================= */ \n'
      },
      build: {
        src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);
}