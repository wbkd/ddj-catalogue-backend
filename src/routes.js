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

var staticRoutes = [{
  method: 'GET',
  path: '/images/{filename}',
  config: {
    handler: function(request, reply) {
      var filename = request.params.filename;
      reply.file('images/' + filename);
    },
    description: 'Returns an image.',
    notes: ['static', 'images', 'upload']
  }
}];


module.exports = [].concat(projectRoutes,staticRoutes);