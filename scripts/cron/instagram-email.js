(function() {
  var Firebase, baseUrl, clientId, cronJob, cronPattern, diffAgainstStored, email, getImagesForUser, getStoredData, getUserId, imageFeeds, request, task, updateStoredData, _;

  cronJob = require('cron').CronJob;

  request = require('request');

  _ = require('lodash');

  Firebase = require('firebase');

  email = require('../email/instagram');

  cronPattern = '*/15 * * * *';

  baseUrl = 'https://api.instagram.com/v1';

  clientId = 'dbe6db79ab8a4891aba87ee06248eefb';

  imageFeeds = new Firebase('https://gunslinger.firebaseio.com/instagram/feeds/');

  getUserId = function(username) {
    var deferred, url;
    url = "" + baseUrl + "/users/search?q=" + username + "&client_id=" + clientId;
    deferred = Q.defer();
    request(url, function(error, response, body) {
      var apiResponse, user;
      apiResponse = JSON.parse(body);
      user = _.first(apiResponse.data);
      return deferred.resolve(user.id);
    });
    return deferred.promise;
  };

  updateStoredData = function(username, images) {
    var dingus;
    dingus = {};
    dingus[username] = images;
    return imageFeeds.set(dingus);
  };

  getStoredData = function(username) {
    var deferred, store;
    deferred = Q.defer();
    store = new Firebase("https://gunslinger.firebaseio.com/instagram/feeds/" + username);
    store.on('value', function(snapshot) {
      return deferred.resolve(snapshot.val());
    });
    return deferred.promise;
  };

  diffAgainstStored = function(username, images) {
    var deferred;
    deferred = Q.defer();
    getStoredData(username).then(function(storedImages) {
      return deferred.resolve(_.difference(images, storedImages));
    });
    return deferred.promise;
  };

  getImagesForUser = function(username) {
    var deferred;
    deferred = Q.defer();
    getUserId(username).then(function(userId) {
      var url;
      url = "" + baseUrl + "/users/" + userId + "/media/recent/?client_id=" + clientId;
      return request(url, function(error, response, body) {
        var apiResponse, images;
        apiResponse = JSON.parse(body);
        images = _.map(apiResponse.data, function(entry) {
          return entry.images.standard_resolution.url;
        });
        return deferred.resolve(images);
      });
    });
    return deferred.promise;
  };

  task = function(username) {
    return getImagesForUser(username).then(function(images) {
      return diffAgainstStored('lpaaskov', images).then(function(diff) {
        console.log('diff', diff);
        if (_.isEmpty(diff)) {
          return;
        }
        return updateStoredData(username, images);
      });
    });
  };

  exports.startJob = function() {
    var job;
    job = new cronJob(cronPattern, task);
    return job.start();
  };

}).call(this);
