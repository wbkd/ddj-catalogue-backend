module.exports = [{
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
  },
  {
    method: 'GET',
    path: '/ui-data',
    config: {
        handler: function(request, reply) {
            reply.file('data/ui-data.json');
        },
        description: 'Returns the UI data for the application.',
        notes: ['static', 'json', 'ui']
     }
  }
];
