var path = require('path');
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var privateConfig = require('../private-config.js');
var apikey = privateConfig.mailchimp.apikey;
var listID = privateConfig.mailchimp.listID;

var winston = require('winston');
winston.add(winston.transports.File, {
  filename: path.resolve(__dirname, '../../logs/mailchimp.log')
});

try { 
  var mailchimpApi = new MailChimpAPI(apikey, { version : '2.0' });
} catch (error) {
  winston.error(error.message);
}

function subscribe(params){

  if(typeof mailchimpApi === 'undefined' || !params.email){
    return false;
  }

  mailchimpApi.call('lists', 'subscribe', { id: listID, email: {email : params.email}, send_welcome: true }, function (error, data) {
    if(error){
      return winston.error(error.message);
    }
    winston.info({message : 'subscribed ' + params.email + ' to list ' + listID });
  });

}

module.exports.subscribe = subscribe;