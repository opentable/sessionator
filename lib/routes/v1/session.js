const model = require('../../models/session.js');

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/v1/sessions/{session_id}',
    handler: (request, reply) => {
      let session_id = request.params.session_id;
      let namespaces = request.query.namespaces;

      model.get({session_id, namespaces}, (err, result) => {
        if (err) {
          return reply({error: err}).code(400);
        }

        reply(result).code(200);
      });
    }
  });

  server.route({
    method: 'DELETE',
    path: '/v1/sessions/{session_id}',
    handler: (request, reply) => {
      let session_id = request.params.session_id;

      model.remove({session_id}, (err, count) => {
        if (err) {
          return reply({error: err}).code(400);
        }

        if (!count) {
          return reply({error: 'invalid_session'}).code(404);
        }

        reply({removed: count}).code(200);
      });
    }
  });
};
