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

function sendSubmitMail(params,cb) {
  var content = 'Hallo,\n\nfolgende URL wurde eingereicht:\n\n' + params.url + '\n\nAnmerkungen:\n\n' + params.description;
  sendMail(content, 'Projekteinreichung',cb);
}

module.exports.sendMail = sendMail;
module.exports.sendSubmitMail = sendSubmitMail;