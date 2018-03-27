/ * Gulpfile.js * / 
// requirements
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babel = require('gulp-babel');

gulp.task('transform', function() {
    return gulp.src('./src/app/static/js/*.jsx')
        .pipe(babel({
            presets: ["es2015", "react", "stage-3"]
        }))
        .pipe(gulp.dest('./src/app/static/js'));
})

gulp.task('js', ['transform'], function() {
    // Assumes a file has been transformed from
    // ./app/src/main.jsx to ./app/dist/main.js
    return browserify('./src/app/static/js/main.js')
        .transform("babelify", {presets: ["es2015", "react", "stage-3"]})
        .bundle()
        .on('error', gutil.log)
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./src/app/static/js/bundled'))
});

gulp.task('default', ['js'], function() {
    gulp.watch('./src/app/static/js/*.jsx', ['js']);
});
