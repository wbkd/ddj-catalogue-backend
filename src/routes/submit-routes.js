var SubmitController = require('../controllers/submit');

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