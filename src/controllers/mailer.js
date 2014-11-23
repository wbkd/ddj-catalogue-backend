var email = require('emailjs');
var privateConfig = require('../private-config');

var mailServer = email.server.connect({
  user: privateConfig.mail.user,
  password: privateConfig.mail.password,
  host: privateConfig.mail.host,
  ssl: true
});

function sendMail(content, subject, cb) {
  mailServer.send({
    text: content,
    from: privateConfig.mail.from,
    to: privateConfig.mail.to,
    subject: subject
  }, cb);
}

function sendSubmitMail(url,cb) {
  var content = 'Hallo,\n\nfolgende URL wurde eingereicht:\n\n' + url;
  sendMail(content, 'Projekteinreichung',cb);
}

module.exports.sendMail = sendMail;
module.exports.sendSubmitMail = sendSubmitMail;