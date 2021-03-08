var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var flatten = require('gulp-flatten');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

var node_modules_path = './node_modules';
// var paths = {
// 	'node': './node_modules',
// 	'assets': './assets'
// }

// remove files in the public folder
gulp.task('clean', function(){
	return gulp.src('./public/*', {read: false})
		.pipe(clean());
});

gulp.task('serve', function(){
	browserSync.init({
		server: {
			baseDir: './public'
		}
	});

	gulp.watch('index.html', ['pages']);
	gulp.watch('app.css',['styles']);
	gulp.watch('app.js',['scripts']);

  gulp.watch(['app.css', 'app.js', 'index.html']).on('change', browserSync.reload);
});


gulp.task('pages', function(){
	return gulp.src('index.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./public'), { base: '.' });

});

// compiles styles with foundation base styles
gulp.task('styles', function(){
	gulp.src('app.css')
	.pipe(cssmin())
	.pipe(gulp.dest('./public'), { base: '.'});
});


gulp.task('scripts', function(){
	gulp.src('app.js')
		.pipe(gulp.dest('./public'));
});


gulp.task('default', ['pages', 'styles','scripts', 'serve']);

gulp.task('build', ['pages', 'styles', 'scripts']);
