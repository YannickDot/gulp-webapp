var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var reload = browserSync.reload;

var paths = {

  output : {
    js : 'dist/js',
    css : 'dist/css',
    templates : 'dist/templates',
    index : 'dist/',
    images : 'dist/img',
  },

  input : {
    js : ['src/js/**/*.js'],
    sass : ['src/scss/**/*.scss'],
    templates : ['src/templates/**/*.html'],
    index : ['src/*.html'],
    images : ['src/img/**/*'],
  },

  server : './src',

  test: [
    'test/spec/**/*.js'
  ]
};


gulp.task('js', function () {
   return gulp.src(paths.input.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(paths.output.js));
});

gulp.task('sass', function () {
    return gulp.src(paths.input.sass)
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(gulp.dest(paths.output.css))
        .pipe(reload({stream:true}));
});

gulp.task('index', function () {
    return gulp.src(paths.input.index)
        .pipe(gulp.dest(paths.output.index))
});

gulp.task('templates', function () {
    return gulp.src(paths.input.templates)
        .pipe(gulp.dest(paths.output.templates))
});

gulp.task('images', function () {
    return gulp.src(paths.input.images)
        .pipe(gulp.dest(paths.output.images))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: paths.server
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('build', function() {
    gulp.start('sass', 'js', 'templates', 'index', 'images');
});

gulp.task('default', ['browser-sync'], function () {

  	gulp.watch(paths.input.index, ['index', 'bs-reload']); //ok
  	gulp.watch(paths.input.templates, ['templates', 'bs-reload']); //ok
  	gulp.watch(paths.input.sass, ['sass']); //ok - TODO : install sass
    gulp.watch(paths.input.js, ['js', 'bs-reload']); //ok
});