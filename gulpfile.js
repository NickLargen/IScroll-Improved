var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('build', function() {
    exec("node build.js")
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
