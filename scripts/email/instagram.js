(function() {
  var callback, emailOptions, sendgrid, test;

  sendgrid = require('sendgrid')('gunslinger (instagram)', 'nutterbutter');

  emailOptions = {
    to: "brandonaaskov@gmail.com",
    from: "brandon@jusu.co",
    subject: "Hello World",
    text: "My first email through SendGrid."
  };

  callback = function(err, json) {
    if (err) {
      return console.error(err);
    }
    console.log(json);
  };

  test = function() {
    return sendgrid.send(emailOptions, callback);
  };

  exports.test = test;

}).call(this);
