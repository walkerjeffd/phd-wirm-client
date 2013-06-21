module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //our JSHint options
        jshint: {
            all: ['src/*.js','src/collections/*.js','src/models/*.js','src/routers/*.js','src/views/*.js'] //files to lint
        },
 
        //our concat options
        concat: {
            options: {
                separator: ';' //separates scripts
            },
            dist: {
                src: ['src/utils.js','src/app.js','src/engine.js',
                      'src/collections/*.js','src/models/*.js','src/routers/*.js','src/views/*.js'], //Using mini match for your scripts to concatenate
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js' //where to output the script
            }
        },

        //our uglify options
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
 
    //load our tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //default tasks to run
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}