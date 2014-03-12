var _ = require('lodash'),
  gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  nodemon = require('gulp-nodemon');

var paths = {
  scripts: ['app.coffee', 'scripts/**/*.coffee']
};

//compiles coffee script files
gulp.task('scripts', function () {
  gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(gulp.dest('./scripts'));
});

// recompile coffeescript files on change
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('nodemon', function () {
  var ignoredFiles = ['.git', 'node_modules', 'README.md'];
  var options = {
    script: 'app.coffee',
    ignore: ignoredFiles,
    ext: 'js coffee json'
  };

  nodemon(options).on('change', ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch', 'nodemon']);
gulp.task('compile', ['scripts']);
gulp.task('develop', ['nodemon']);
