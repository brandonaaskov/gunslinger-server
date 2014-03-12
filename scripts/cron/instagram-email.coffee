cronJob = require('cron').CronJob
request = require('request')
_ = require('lodash')
Firebase = require('firebase')
email = require '../email/instagram'

cronPattern = '*/15 * * * *'
baseUrl = 'https://api.instagram.com/v1'
clientId = 'dbe6db79ab8a4891aba87ee06248eefb'
imageFeeds = new Firebase('https://gunslinger.firebaseio.com/instagram/feeds/')

getUserId = (username) ->
  url = "#{baseUrl}/users/search?q=#{username}&client_id=#{clientId}"
  deferred = Q.defer()
  request url, (error, response, body) ->
    apiResponse = JSON.parse(body)
    user = _.first(apiResponse.data)
    deferred.resolve user.id
  return deferred.promise

updateStoredData = (username, images) ->
  dingus = {}
  dingus[username] = images
  imageFeeds.set(dingus)

getStoredData = (username) ->
  deferred = Q.defer()
  store = new Firebase("https://gunslinger.firebaseio.com/instagram/feeds/#{username}")
  store.on 'value', (snapshot) -> deferred.resolve snapshot.val()
  return deferred.promise

diffAgainstStored = (username, images) ->
  deferred = Q.defer()
  getStoredData(username).then (storedImages) ->
    deferred.resolve _.difference(images, storedImages)
  return deferred.promise

getImagesForUser = (username) ->
  deferred = Q.defer()

  getUserId(username).then (userId) ->
    url = "#{baseUrl}/users/#{userId}/media/recent/?client_id=#{clientId}"
    request url, (error, response, body) ->
      apiResponse = JSON.parse(body)
      images = _.map apiResponse.data, (entry) -> entry.images.standard_resolution.url
      deferred.resolve images
  return deferred.promise

task = (username) ->
  getImagesForUser(username).then (images) ->
    diffAgainstStored('lpaaskov', images).then (diff) ->
      console.log 'diff', diff
      return if _.isEmpty diff
      updateStoredData(username, images)

exports.startJob = ->
  job = new cronJob cronPattern, task
  console.log 'email', email.test()
  job.start()