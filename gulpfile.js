const gulp = require('gulp');

//
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const htmlmin = require('gulp-htmlmin');

const size = require('gulp-size');
const notify = require('gulp-notify');
const webpack = require("webpack-stream");


function minhtml() {
    return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
}

function srcSize() {
    const s = size();

	return gulp.src('src/**/*')
		.pipe(s)
		.pipe(notify({
			onLast: true,
			message: () => `Total size ${s.prettySize}`
		}));
}

function distSize() {
    const s = size();

	return gulp.src('dist/**/*')
		.pipe(s)
		.pipe(notify({
			onLast: true,
			message: () => `Total size ${s.prettySize}`
		}));
}


function buildJS() {
    return gulp.src("./src/js/script.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'bundle.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest('src/js'));
}

function buildProdJS() {
    return gulp.src("./src/js/script.js")
    .pipe(webpack({
        mode: 'production',
        output: {
            filename: 'js/bundle.js'
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [['@babel/preset-env', {
                        corejs: 3,
                        useBuiltIns: "usage"
                    }]]
                  }
                }
              }
            ]
          }
    }))
    .pipe(gulp.dest('dist'));
}



function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });
}

function prodsync() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
}

function cleanDist() {
    return del('dist');
}

function images() {
    return gulp.src('src/img/**/*')
    .pipe(size())
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(size())
    .pipe(gulp.dest('dist/img'));
}

function scripts() {

    return gulp.src([
        'src/js/script2.js',
        'src/js/script.js'
    ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
}

function styles() {
    return gulp.src('src/sass/style.scss')
    .pipe(size())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrwserlist: ['last 10 version'],
        grid: true,
    }))
    .pipe(size())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function build() {
    return gulp.src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        // 'src/js/script.min.js',
        // 'src/*.html',
    ], {base: 'src'})
    .pipe(gulp.dest('dist'));
}


function watching() {
    gulp.watch(['src/sass/**/*.scss'], styles);
    gulp.watch(['src/js/**/*.js', '!src/js/bundle.js'], buildJS).on('change', browserSync.reload);
    gulp.watch(['src/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.buildProdJS = buildProdJS;
exports.prodsync = prodsync;


exports.build = gulp.series(srcSize, cleanDist, styles, images, minhtml, build, buildProdJS, distSize);
exports.default = gulp.parallel(styles, buildJS, browsersync, watching);