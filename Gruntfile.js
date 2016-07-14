module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* Sass compiler Task
		 /* ----------------------------- */
		sass: {
			main: {
				options: {
					style: 'nested',
					sourcemap: 'auto',
					noCache: true
				},
				files: [{
					expand: true,
					cwd: 'assets/scss',
					src: ['*.scss'],
					dest: 'assets/css',
					ext: '.min.css'
				}]
			}
		},

		/* Combine CSS Media Queries
		 /* ----------------------------- */
		cmq: {
			options: {
				log: true
			},
			your_target: {
				files: {
					'assets/css': ['assets/css/*.css']
				}
			}
		},

		/* Auto pre fixer
		 /* ----------------------------- */
		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({
						browsers: ['> 1%', 'ie 9']
					})
				]
			},
			dist: {
				src: 'assets/css/style.min.css',
				dest: 'assets/css/style.min.css'
			}
		},

		/* Minify CSS
		 /* ----------------------------- */
		cssmin: {
			options: {
				compatibility: 'ie8',
				sourceMap: true
			},
			target: {
				files: [{
					expand: true,
					cwd: 'assets/css',
					src: ['*.css'],
					dest: 'assets/css',
					ext: '.min.css'
				}]
			}
		},

		/* Imagemin Task
		 /* ----------------------------- */
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'assets/img',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'assets/img'
				}]
			}
		},

		/* Watch Task
		 /* ----------------------------- */
		watch: {
			css: {
				files: ['**/*.scss'],
				tasks: ['sass', 'cmq', 'cssmin'],
				options: {
					event: ['changed', 'added', 'deleted']
				}
			},
			images: {
				files: ['assets/img'],
				tasks: ['imagemin'],
				options: {
					event: ['added', 'changed'],
					spawn: false
				}
			},
			templates: {
				files: ['src/templates/**/*.html'],
				tasks: ['templates'],
				optiosn: {
					events: ['changed', 'added', 'deleted']
				}
			}
		},

		/* Webfonts
		 /* ----------------------------- */
		webfont: {
			icons: {
				src: 'assets/img/svg_icons/*.svg',
				dest: 'assets/fonts/icon_font/',
				destCss: 'assets/scss/layout/',
				options: {
					// engine: 'node',
					types: 'eot,woff,ttf,svg',
					stylesheet: 'scss',
					relativeFontPath: '../fonts/icon_font/',
					destHtml: 'assets/fonts/icon_font/',
					syntax: 'bootstrap',
					templateOptions: {
						baseClass: 'icon',
						classPrefix: 'icon-'
					}
				}
			}
		},

		systemjs: {
			options: {
				sfx: true,
				baseURL: './',
				transpiler: 'typescript',
				configFile: './systemjs.config.js',
				minify: true,
				build: {
					mangle: true
				}
			},
			app: {
				files: [{
					src: 'app/main.js',
					dest: 'app/app.min.js'
				}]
			}
		},

		concat: {
			files: {
				src: [
					'node_modules/intl/dist/Intl.min.js',
					'node_modules/intl/locale-data/jsonp/en.js',
					'node_modules/core-js/client/shim.min.js',
					'node_modules/zone.js/dist/zone.js',
					'node_modules/reflect-metadata/Reflect.js',
					'node_modules/systemjs/dist/system.js',
					'app/app.min.js'
				],
				dest: 'app/app.min.js'
			}
		},

		compress: {
			app: {
				options: {
					archive: 'app.zip'
				},
				files: [
					{src: ['index.prod.html'], dest: '.'},
					{src: ['app/app.min.*'], dest: '.'},
					{src: ['assets/**'], dest: '.'}
				]
			}
		}
	});


	/* Load plugins
	 /* ----------------------------- */
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-webfont');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-systemjs-builder');
	grunt.loadNpmTasks('grunt-contrib-compress');

	/* Tasks
	 /* ----------------------------- */
	grunt.registerTask('default', ['sass', 'cmq', 'postcss', 'cssmin', 'imagemin']);
	grunt.registerTask('css', ['sass', 'cmq', 'postcss', 'cssmin']);
	grunt.registerTask('iconfont', ['webfont']);
	grunt.registerTask('images', ['imagemin']);
	grunt.registerTask('dev', ['sass', 'cmq', 'postcss', 'imagemin']);
	grunt.registerTask('package', ['systemjs', 'concat', 'compress']);
};
