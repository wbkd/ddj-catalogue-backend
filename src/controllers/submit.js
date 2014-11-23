var Hapi = require('hapi');

var Mailer = require('./mailer');
var urlPattern = new RegExp(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

module.exports.submit = function(req, reply) {
  // TODO: check if url exists in DB

  var projectUrl = req.payload.url,
    isValidUrl = urlPattern.test(projectUrl);

  if(!isValidUrl){
    return reply({ error: 'Bitte geben Sie eine gültige URL an.' });
  }

  Mailer.sendSubmitMail(projectUrl, function(error,message){

    if(error){
      return reply(Hapi.error.badRequest('Technische Störung. Projekt konnte nicht eingereicht werden.')); 
    }

    reply({message : 'successfully submitted'});
  });
};
