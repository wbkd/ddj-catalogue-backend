var config = require('./config');
var ProjectController = require('./controllers/project');

var projectRoutes = [
		
	{
		method : 'get',
		path : config.api + 'projects',
		config : {
			handler : ProjectController.getAll
		}
	},
	{
		method : 'post',
		path : config.api + 'projects',
		config : {
			handler : ProjectController.query
		}
	},


];

module.exports = projectRoutes;