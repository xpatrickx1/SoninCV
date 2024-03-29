var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});



gulp.task('images', function(){
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
    gulp.src(['src/styles/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('sass', function () {
    return gulp.src('src/styles/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css/'));
});


gulp.task('pug', function buildHTML() {
    return gulp.src('*.pug')
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('scripts', function(){
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch("src/styles/**/*.scss", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch('src/styles/*.sass', ['sass']);
    gulp.watch("*.pug", ['pug']);
    gulp.watch("*.html", ['bs-reload']);
});