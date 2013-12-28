module.exports = function ( grunt ) {
    "use strict";

    /**
     * Grunt Config
     */
    grunt.initConfig({

        /**
         * Get package.json data
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * JSBeautifier
         */
        jsbeautifier: {
            dev: {
                src: ["src/**/*.js"],
                options: {
                    config: ".jsbeautifyrc"
                }
            }
        },

        /**
         * JSHint
         */
        jshint: {
            dev: {
                options: {
                    jshintrc: ".jshintrc"
                },
                files: {
                    src: [ "src/*.js" ]
                }
            }
        },

        /**
         * Uglify
         */
        uglify: {
            src: {
                options: {
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %> */\n",
                    beautify: {
                        width: 80,
                        beautify: true
                    }
                },
                files: {
                    "dist/umdrouter.min.js": ["src/umdrouter.js"]
                }
            }
        }

    });

	grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["jsbeautifier", "jshint", "uglify"]);

};