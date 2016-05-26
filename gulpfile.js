var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function() {
  return gulp
    .src("sass/style.scss")
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest("css"));
});

gulp.task('watch', function() {
  livereload.listen(4000);
  gulp.watch('sass/style.scss', ['sass']);
  gulp.watch(['index.html', 'js/*.js'])
});
