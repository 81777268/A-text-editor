var gulp = require('gulp');
//var copy = require('gulp-copy');
var minify = require('gulp-min');
var seajs = require('gulp-seajs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');


var compass = require('gulp-for-compass');
//var compress = require('gulp-yuicompressor');
//var closureCompiler = require('gulp-closure-compiler');


gulp.task('compass', function() {
	gulp.src('src/sass/*.scss')
		.pipe(compass({
			sassDir : 'src/sass',
			cssDir : 'public/css',
			imagesDir : 'src/sass/images',
			outputStyle : 'compressed',
			force : true
		}));
});


// hot-debug
// gulp.task('hot-debug', function(){
// 	gulp.src(['src/hot/main.js'])
// 		.pipe(seajs('hot/main'))
// 		.pipe(gulp.dest('public/js/hot/'));
// });
gulp.task('fonts', function(){
    gulp.src(['src/fonts'])
        .pipe(gulp.dest('public/fonts'));

gulp.task('images', function(){
    gulp.src(['src/images'])
        .pipe(gulp.dest('public/images'));

gulp.task('css-images', function(){
    gulp.src(['src/sass/images'])
        .pipe(gulp.dest('public/css/images'));

gulp.task('lib', function(){
    gulp.src(['src/lib'])
        .pipe(gulp.dest('public/lib'));


gulp.task('src', ['fonts','images','lib','css-images']);

gulp.task('default', [ 'compass','src' ]);