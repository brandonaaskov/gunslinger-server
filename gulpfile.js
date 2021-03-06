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

//pushes up to heroku
gulp.task('deploy', function () {
  var sys = require('sys');
  var exec = require('child_process').exec;
  function puts(stdout, stderr) {
    if (stdout) sys.puts(stdout)
    if (stderr) sys.puts(stderr)
  }
  exec("git push heroku master", function (stdout, stderr) {
    puts(stdout, stderr);
  });
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
