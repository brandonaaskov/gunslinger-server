(function() {
  var renameFile;

  renameFile = function(req) {
    return console.log('req', req);
  };

  exports.renameFile = renameFile;

}).call(this);
