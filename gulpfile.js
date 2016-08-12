var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

gulp.task('default', ['copy-html', 'copy-libs', 'minify-js', 'minify-css']);

gulp.task('clean', function() {
    return del(['bin/']);
});

gulp.task('copy-html', function(cb) {
    pump([
            gulp.src('src/*.html'),
            gulp.dest('bin')
        ],
        cb
    );
});

gulp.task('copy-libs', function(cb) {
    pump([
            gulp.src('lib/*'),
            gulp.dest('bin')
        ],
        cb
    );
});

gulp.task('minify-js', function(cb) {
    pump([
            gulp.src('src/*.js'),
            uglify(),
            gulp.dest('bin')
        ],
        cb
    );
});

gulp.task('minify-css', function(cb) {
    pump([
            gulp.src('src/*.css'),
            cleanCSS(),
            gulp.dest('bin')
        ],
        cb
    );
});
