var Hapi = require('hapi');
var Joi = require('joi');

var Mailer = require('./mailer');
var urlPattern = new RegExp(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

var validationScheme = {
    email: Joi.string().email()
};

module.exports.submitProject = function(req, reply) {
  // TODO: check if url exists in DB

  var projectUrl = req.payload.url,
    projectDescription = req.payload.description || 'Keine Anmerkungen',
    isValidUrl = urlPattern.test(projectUrl);

  if(!isValidUrl){
    return reply({ error: 'Bitte geben Sie eine gültige URL an.' });
  }

  Mailer.sendProjectSubmitMail({url : projectUrl, description: projectDescription} , function(error,message){

    if(error){
      return reply(Hapi.error.badRequest('Technische Störung. Projekt konnte nicht eingereicht werden.')); 
    }

    reply({message : 'successfully submitted'});
  });
};


module.exports.submitEmail = function(req, reply) {
  // TODO: check if url exists in DB
  var userEmail = req.payload.email;

  if(!userEmail){
    return reply({ error: 'Bitte geben Sie eine gültige E-Mail an.' });
  }

  Joi.validate({ email: userEmail }, validationScheme, function (err, value) {

    if(err){
      return reply({ error: 'Bitte geben Sie eine gültige E-Mail an.' });
    }

    Mailer.sendEmailSubmitMail({email : userEmail} , function(error,message){

      if(error){
        return reply(Hapi.error.badRequest('Technische Störung. Sie konnten nicht eingetragen werden.')); 
      }

      reply({message : 'successfully submitted'});
    });

  });


};