var Mailer = require('../controllers/mailer');

module.exports = [{
    method: 'post',
    path: '/submit',
    config: {
      handler: function(request, reply) {
        var projectUrl = request.payload.url;
        Mailer.sendSubmitMail(projectUrl);
        reply({message : 'successfully submitted'});
      },
      description: 'Submits a project',
      notes: ['submit']
    }
  }
];