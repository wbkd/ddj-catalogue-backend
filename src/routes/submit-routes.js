var SubmitController = require('../controllers/submit');
var Mailer = require('../controllers/mailer');

module.exports = [{
    method: 'post',
    path: '/submit',
    config: {
      handler: SubmitController.submit,
      description: 'Submits a project',
      notes: ['submit']
    }
  }
];