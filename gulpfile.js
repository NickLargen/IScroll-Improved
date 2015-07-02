'use-strict';

var projectName = 'IScroll Improved';

var gulp = require('gulp');
var exec = require('child_process').exec;
var browserSync = require("browser-sync").create(projectName);
var reload = browserSync.reload;

gulp.task('build', function () {
    exec("node build.js");
});

gulp.task('serve', function () {
    // .init starts the server
    browserSync.init({
        server: {
            baseDir: ".",
            index: "demos/scrollbars/index.html"
        },
        files: ["demos/**", "build/**"],
        browser: ["chrome", "firefox"],
        logLevel: 'info',
        host: "192.168.1.12",
        // Assume there is an active internet connection 
        online: true,
        // Don't show any notifications in the browser.
        notify: false,
        // Log connections
        logConnections: true,
        logPrefix: projectName
    });
    
    gulp.watch('src/**', ['build']);
});

gulp.task('default', ['serve']);
