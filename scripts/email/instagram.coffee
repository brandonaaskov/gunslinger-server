sendgrid = require('sendgrid')('gunslinger (instagram)', 'nutterbutter')

emailOptions =
  to: "brandonaaskov@gmail.com"
  from: "brandon@jusu.co"
  subject: "Hello World"
  text: "My first email through SendGrid."

callback = (err, json) ->
  return console.error(err) if err
  console.log json
  return

test = ->
  sendgrid.send emailOptions, callback

exports.test = test