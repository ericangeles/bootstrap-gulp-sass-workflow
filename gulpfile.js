/* ---- Import packages for gulp ---- */
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

/* ---- File Paths ---- */
var config = {
  sassPath: './src/sass',
  bowerDir: './bower_components',
  jsPath: './src/js'
}

/* ---- Task for running bower ---- */
gulp.task('bower', function() {
  return bower()
  .pipe(gulp.dest(config.bowerDir))
});

/* ---- Concatenate and Minify JS ---- */
gulp.task('scripts', function() {
  return gulp.src(config.jsPath + '/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist/resource/js'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/resource/js'))
        .pipe(browserSync.stream());
});

/* ---- Font Awesome Directory ---- */
gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
  .pipe(gulp.dest('./dist/resource/fonts'));
});

/* ---- Compressed, Reload and Convert SCSS to CSS, create source map  ---- */
gulp.task('css', function() {
  return gulp.src('./src/sass/style.scss')
  .pipe(sass({
    style: 'compressed',
    loadPath: [
      './src/sass',
      config.bowerDir + '/bootstrap-sass/assets/stylesheets',
      config.bowerDir + '/font-awesome/scss',
    ]
  })
  .on("error", notify.onError(function (error) {
    return "Error: " + error.message;
  })))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./dist/resource/css'))
  .pipe(browserSync.stream());
});

/* ---- Watch Tasks ---- */
gulp.task('serve', function() {
  browserSync.init({
    server: "./"
  });
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  gulp.watch(config.jsPath + '/*.js', ['scripts']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

/* ---- Build ---- */
gulp.task('default', ['bower', 'scripts', 'icons', 'serve', 'css']);
