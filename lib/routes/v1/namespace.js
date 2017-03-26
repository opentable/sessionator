const model = require('../../models/namespace.js');

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/v1/sessions/{session_id}/{namespace_id}',
    handler: (request, reply) => {
      let session_id = request.params.session_id;
      let namespace_id = request.params.namespace_id;

      model.get({session_id, namespace_id}, (err, data) => {
        if (err) {
          return reply({error: err}).code(400);
        }

        if (!data) {
          return reply({error: 'not_found'}).code(404);
        }

        reply(data).code(200);
      });
    }
  });

  server.route({
    method: 'DELETE',
    path: '/v1/sessions/{session_id}/{namespace_id}',
    handler: (request, reply) => {
      let session_id = request.params.session_id;
      let namespace_id = request.params.namespace_id;

      model.remove({session_id, namespace_id}, (err, count) => {
        if (err) {
          return reply({error: err}).code(400);
        }

        if (!count) {
          return reply({error: 'not_found'}).code(404);
        }

        reply({success: true}).code(200);
      });
    }
  });

  server.route({
    method: 'PUT',
    path: '/v1/sessions/{session_id}/{namespace_id}',
    handler: (request, reply) => {
      let session_id = request.params.session_id;
      let namespace_id = request.params.namespace_id;
      let body = request.payload;

      if (typeof body !== 'object' || Array.isArray(body)) {
        return reply({error: 'root_must_be_object'}).code(400);
      }

      model.set({session_id, namespace_id, body}, (err, data) => {
        if (err) {
          return reply({error: err}).code(400);
        }

        reply(data).code(200);
      });
    }
  });
};

