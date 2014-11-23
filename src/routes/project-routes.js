var config = require('../config');
var ProjectController = require('../controllers/project');

module.exports = [  
  {
    method : 'GET',
    path : config.api + 'projects',
    config : {
      handler : ProjectController.getAll
    }
  },
  {
    method : 'GET',
    path : config.api + 'projects/{id}',
    config : {
      handler : ProjectController.getById
    }
  },
  {
    method : 'POST',
    path : config.api + 'projects',
    config : {
      handler : ProjectController.query
    }
  },
  {
    method : 'POST',
    path : config.api + 'projects/getbyids',
    config : {
      handler : ProjectController.getByIds
    }
  }
];