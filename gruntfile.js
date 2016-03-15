module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var PROJECT_PATH = '';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                outputStyle: 'compact' // compressed
            },
            projectDefault: {
                files: [{
                    expand: true,
                    cwd: PROJECT_PATH + 'scss',
                    src: ['**/*.scss'],
                    dest: PROJECT_PATH + 'css',
                    ext: ".css"
                }]
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['watch']);
};