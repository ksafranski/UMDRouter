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
        
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    grunt.registerTask("default", ["jshint", "uglify"]);
    
};