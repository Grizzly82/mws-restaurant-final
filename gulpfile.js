var gulp = require('gulp');

// Requires the gulp-sass plugin
const cssScss = require('gulp-css-scss');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-clean-css');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var cache = require('gulp-cache');
const minify = require('gulp-minify');
const image = require('gulp-image');



 /*  gulp.task('cssscss', () => {
    return gulp.src('app/css/styles.css')
      .pipe(cssScss())
      .pipe(gulp.dest('app/scss'))
      .pipe(browserSync.reload({
        stream: true
      }))
  });
 */
  gulp.task('css-scss', () => {
    return gulp.src('app/css/*.css')
      .pipe(cssScss())
      .pipe(gulp.dest('app/scss'))
      .pipe(browserSync.reload({
        stream: true
      }))
  });

/*   gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulp.dest('dist'))
  }); */
/*
  gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
  });

  */

  
  gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('images', function(){
  return gulp.src('app/img/*')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({ 
      optimizationLevel: 3,
       progressive: true, 
       interlaced: true 
    })))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('image', function () {
  gulp.src('app/img/*')
    .pipe(image())
    .pipe(gulp.dest('app/img'));
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
  })

  gulp.task('default', ['css-scss']);

  //browsersync
  gulp.task('browserSync', function() {
  browserSync.init({
    port:8000,
    open:false,
   // https: true,
    server: {
      baseDir: 'app'
    },
  })
})



gulp.task('lint', function(){
  return gulp.src('files/*.js')
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter())
});
 

gulp.task('compress', function() {
  gulp.src(['app/js/*.js', 'app/js/*.mjs'])
    .pipe(minify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', ['browserSync', 'css-scss','images', 'image','html', 'compress'], function (){
    gulp.watch('app/css/*.css', ['css-scss']); 
    gulp.watch('files/*.js', ['lint']);
    // Other watchers
  });



  gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      [ 'useref', 'images'],'watch',
      callback
    )
  })


// Default Task
gulp.task('default', [ 'browserSync', 'images','image','html', 'watch','lint','compress']);