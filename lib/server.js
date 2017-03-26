const hapi = require('hapi');

const server = new hapi.Server();

const routes = {
  namespace: require('./routes/v1/namespace.js'),
  session: require('./routes/v1/session.js')
};

const port = process.env.HTTP_PORT || 80;
const host = process.env.HTTP_HOST || '0.0.0.0';

server.connection({
  port,
  host
});

routes.namespace(server);
routes.session(server);

module.exports = server;

