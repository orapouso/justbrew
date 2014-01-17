module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    env: {
      production: {
        NODE_ENV: 'production',
        ROOT: require('path').normalize(__dirname)
      },
      dev: {
        NODE_ENV: 'development',
        ROOT: require('path').normalize(__dirname) + '/src'
      },
      test: {
        NODE_ENV: 'test',
        ROOT: require('path').normalize(__dirname) + '/src'
      }
    },

    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src/', src: ['app/**', 'public/**', 'server.js', 'user-config.js'], dest: 'build/' }
        ]
      },
      dev: {
        files: [
          { expand: true, cwd: 'src/web/', src: ['templates/**'], dest: 'src/public/'},
          { expand: true, flatten: true, cwd: 'src/web/', src: ['components/**/*.map'], dest: 'src/public/js/'},
        ]
      }
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      dev: {
        src: [ 'log', 'src/public/templates', 'src/public/css', 'src/public/js' ]
      },
      all: {
        src: [ 'venv', 'node_modules', 'src/web/components', 'dist' ]
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      bower: {
        command: 'node ./node_modules/bower/bin/bower install'
      },
      server: {
        command: './node_modules/.bin/nodemon src/server.js'
      },
      migrate: {
        command: './node_modules/.bin/migrate -c src'
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'dist/<%= pkg.name %>-v<%=pkg.version %>.tar.gz'
        },
        files: [
          {expand: true, cwd: 'build/', src:['**'], dest: '<%= pkg.name %>/'}
        ]
      }
    },

    watch: {
      stylus: {
        files: 'src/web/stylus/**/*.styl',
        tasks: [ 'stylus' ]
      },
      scripts: {
        files: 'src/web/scripts/**/*.js',
        tasks: ['test:unit', 'concat' ]
      },
      templates: {
        files: 'src/web/templates/**',
        tasks: ['test:unit', 'copy:dev' ]
      },
      tests: {
        files: 'test/web/unit/**/*.js',
        tasks: [ 'test:unit' ]
      },
      node: {
        files: [ 'src/app/**/*.js', 'test/app/**/*.js' ],
        tasks: [ 'test:node' ]
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/web/script/**/*.js', 'test/web/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },

    stylus: {
      dev: {
        options: {
          import: [
            'nib',
            'util'
          ]
        },
        files: {
          'src/public/css/app.css': [
            'src/web/stylus/header.styl',
            'src/web/stylus/app.styl'
          ],
          'src/public/css/login.css': [
            'src/web/stylus/header.styl',
            'src/web/stylus/app.styl',
            'src/web/stylus/login.styl'
          ]
        }
      }
    },

    concat: {
      scripts: {
        options: {
          separator: ';'
        },
        files: {
          'src/public/js/app.js': [
            'src/web/components/angular/angular.min.js',
            'src/web/components/angular-resource/angular-resource.min.js',
            'src/web/components/angular-cookies/angular-cookies.min.js',
            'src/web/components/angular-route/angular-route.min.js',
            'src/web/components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/web/scripts/class.js',
            'src/web/scripts/util.js',
            'src/web/scripts/templates.js',
            'src/web/scripts/app.js',
            'src/web/scripts/resources.js',
            'src/web/scripts/model.js',
            'src/web/scripts/controllers.js',
            'src/web/scripts/directives.js',
            'src/web/scripts/route.js'
          ],
          'src/public/js/login.js': [
            'src/web/components/angular/angular.min.js',
            'src/web/components/angular-cookies/angular-cookies.min.js',
            'src/web/scripts/login.js',
          ]
        }
      }
    },

    connect: {
      options: {
        port: 8000,
      },
      server: {
        options: {
          keepalive: true
        }
      },
      testserver: {}
    },

    mochaTest: {
      dev: {
        options: {
          mocha: require('mocha'),
          reporter: 'spec',
          require: [
            'should', 'src/app/config/util.js',
            'src/app/models/company.js',
            'src/app/models/equipment.js',
            'src/app/models/ingredient.js',
            'src/app/models/purchase.js',
            'src/app/models/user.js'
          ]
        },
        src: 'test/app/**/*.js'
      }
    },

    karma: {
      devE2e: {
        configFile: 'test/web/karma-e2e.conf.js'
      },
      devUnit: {
        configFile: 'test/web/karma-unit.conf.js'
      },
      unit: {
        configFile: 'test/web/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e: {
        configFile: 'test/web/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      }
    }
  });

  grunt.registerTask('test', ['karma:unit', 'server', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['server', 'karma:e2e']);
  grunt.registerTask('test:dev', ['karma:devUnit']);
  grunt.registerTask('test:dev:e2e', ['server', 'karma:devE2e']);
  grunt.registerTask('test:node', ['env:test', 'mochaTest:dev']);

  grunt.registerTask('install', ['shell:bower']);
  grunt.registerTask('migrate', ['shell:migrate']);
  grunt.registerTask('build:common', ['jshint', 'test:node', 'test:unit', 'stylus', 'concat']);
  grunt.registerTask('build:dev', ['clean:dev', 'build:common', 'copy:dev']);
  grunt.registerTask('dev', ['build:dev', 'watch']);
  grunt.registerTask('build', ['clean:build', 'build:common', 'copy:build']);
  grunt.registerTask('dist', ['build', 'compress:dist']);

  grunt.registerTask('server', ['shell:server']);

  grunt.registerTask('default', ['dev']);
};
