var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var cache       = require('gulp-cache');
var rename      = require('gulp-rename');
var filter      = require('gulp-filter');
//var sass      = require('gulp-sass');
var sass        = require('gulp-ruby-sass');
var imagemin    = require('gulp-imagemin');
var rimraf      = require('gulp-rimraf');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var paths = {

  dist : 'dist/**',

  output : {
    js : 'dist/js',
    css : 'dist/css',
    templates : 'dist/templates',
    index : 'dist/',
    images : 'dist/img',
  },

  input : {
    js : ['src/js/**/*.js', 'src/js/*.js'],
    sass : ['src/scss/**/*.scss', 'src/scss/*.scss'],
    templates : ['src/templates/**/*.html', 'src/templates/*.html'],
    index : ['src/*.html'],
    images : ['src/img/**/*', 'src/img/*'],
  },

  server : './dist',

  test: [
    'test/spec/**/*.js'
  ]
};

gulp.task('clean', function() {
  return gulp.src(paths.dist, { read: false })
    .pipe(rimraf());
});


gulp.task('js-dev', function () {
   return gulp.src(paths.input.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(paths.output.js));
});

gulp.task('js', function () {
   return gulp.src(paths.input.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(paths.output.js));
});

gulp.task('sass-dev', function () {
    return gulp.src(paths.input.sass)
        .pipe(sass({style: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.output.css))
        .pipe(filter('**/*.css'))
        .pipe(reload({stream:true}));
});

gulp.task('sass', function () {
    return gulp.src(paths.input.sass)
        .pipe(sass({style: 'compressed'}))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.output.css))
        .pipe(filter('**/*.css'))
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
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
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

gulp.task('build-dev', ['clean'], function() {
    gulp.start('sass-dev', 'js-dev', 'templates', 'index', 'images');
});

gulp.task('build', ['clean'], function() {
    gulp.start('sass', 'js', 'templates', 'index', 'images');
});

gulp.task('default', ['build-dev', 'browser-sync'], function () {
    gulp.watch(paths.input.index, ['index', 'bs-reload']); 
    gulp.watch(paths.input.templates, ['templates', 'bs-reload']); 
    gulp.watch(paths.input.sass, ['sass-dev']); 
    gulp.watch(paths.input.js, ['js-dev', 'bs-reload']); 
    gulp.watch(paths.input.images, ['images', 'bs-reload']); 
});