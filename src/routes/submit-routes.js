var SubmitController = require('../controllers/submit');
var Mailer = require('../controllers/mailer');

module.exports = [
  {
    method: 'POST',
    path: '/submit/project',
    config: {
      handler: SubmitController.submitProject,
      description: 'Submits a project',
      notes: ['submit']
    }
  },
  {
    method: 'POST',
    path: '/submit/email',
    config: {
      handler: SubmitController.submitEmail,
      description: 'Submits an email',
      notes: ['submit']
    }
  },

];