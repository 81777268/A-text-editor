var gulp = require('gulp');
//var copy = require('gulp-copy');
var minify = require('gulp-min');
var seajs = require('gulp-seajs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var changed = require('gulp-changed');

var compass = require('gulp-for-compass');

var seajsCombo = require( 'gulp-seajs-combo' );

//var compress = require('gulp-yuicompressor');
//var closureCompiler = require('gulp-closure-compiler');


//css编译
gulp.task('compass', function() {
	gulp.src('src/sass/*.scss')
		//.pipe(changed('public/css',{extension:'.css'}))
		.pipe(compass({
			sassDir : 'src/sass',
			cssDir : 'public/css',
			imagesDir : 'src/sass/images',
			outputStyle : 'expanded',
			force : true
		}));
});

gulp.task('base64-js', function(){
	gulp.src(['src/js/common/base64.js'])
		.pipe(seajs('common/base64'))
		.pipe(gulp.dest('public/js/common'));
});

gulp.task('weui-js', function(){
	gulp.src(['src/js/common/weui.js'])
		.pipe(seajs('common/weui'))
		.pipe(gulp.dest('public/js/common'));
});

gulp.task('editor-js', function(){
	gulp.src(['src/js/weeditor/editor.js'])
		.pipe(seajs('weeditor/editor'))
		.pipe(gulp.dest('public/js/weeditor'));
});

gulp.task('header-js', function(){
	gulp.src(['src/js/common/header.js'])
		.pipe(seajs('common/header'))
		.pipe(gulp.dest('public/js/common'));
});

gulp.task('myArticle-js', function(){
	gulp.src(['src/js/myArticle/main.js'])
		.pipe(seajs('myArticle/main'))
		.pipe(gulp.dest('public/js/myArticle'));
});
gulp.task('Hotcontent-js', function(){
	gulp.src(['src/js/Hotcontent/Hotcontent.js'])
		.pipe(seajs('Hotcontent/Hotcontent'))
		.pipe(gulp.dest('public/js/Hotcontent'));
});
gulp.task('main-js', function(){
	gulp.src(['src/js/auth/main.js'])
		.pipe(seajs('auth/main'))
		.pipe(gulp.dest('public/js/auth'));
});
gulp.task('Authorize_manage-js', function(){
	gulp.src(['src/js/Authorize_manage/Authorize_manage.js'])
		.pipe(seajs('Authorize_manage/Authorize_manage'))
		.pipe(gulp.dest('public/js/Authorize_manage'));
});


gulp.task('fonts', function(){
    gulp.src(['src/fonts/*'])
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('images', function(){
    gulp.src(['src/images/*'])
        .pipe(gulp.dest('public/images'));
});
gulp.task('css-images', function(){
    gulp.src(['src/sass/images/*'])
        .pipe(gulp.dest('public/css/images'));
});        

gulp.task('lib', function(){
    gulp.src(['src/lib/*'])
        .pipe(gulp.dest('public/lib'));
});



gulp.task('js', 
	['base64-js','editor-js','header-js','myArticle-js','Hotcontent-js','main-js','Authorize_manage-js','weui-js']);




gulp.task('src', ['fonts','images','lib','css-images']);

gulp.task('watch', function() {
	gulp.watch('src/sass/*.scss', [ 'compass' ]);
	gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', [ 'compass','src','js']);
