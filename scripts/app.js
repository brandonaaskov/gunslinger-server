(function() {
  var app, express, http, instagram, path;

  http = require('http');

  path = require('path');

  express = require('express');

  instagram = require('./scripts/cron/instagram-email');

  app = express();

  app.set('port', process.env.PORT || 3000);

  app.use(express.favicon());

  app.use(express.logger('dev'));

  app.use(express.json());

  app.use(express.urlencoded());

  app.use(express.methodOverride());

  app.use(app.router);

  app.use(express['static'](path.join(__dirname, 'static/')));

  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }

  http.createServer(app).listen(app.get('port'), function() {
    return console.log('Express server listening on port ' + app.get('port'));
  });

  instagram.startJob();

}).call(this);
