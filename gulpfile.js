var _ = require('lodash'),
  gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  nodemon = require('gulp-nodemon'),
  through = require('through');

var paths = {
  scripts: ['app.coffee', 'scripts/**/*.coffee']
};

gulp.task('scripts', function() {
  // place code for your default task here
  gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(gulp.dest('./scripts'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('nodemon', function () {
  var ignore = ['.git', 'node_modules', 'README.md'];
  var options = {
    script: 'app.coffee',
    ignore: ignore,
    ext: 'js coffee json'
  };

  nodemon(options)
    .on('change', ['compile'])
    .on('restart', function () {
      console.log('restarted!')
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);
gulp.task('compile', ['scripts']);
gulp.task('develop', ['nodemon'])
