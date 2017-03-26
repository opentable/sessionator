const redis = require('../redis.js');

module.exports.get = function getSessionNamespace(params, callback) {
  let session_id = params.session_id;
  let namespace_id = params.namespace_id;

  redis.hget(session_id, namespace_id, (err, data) => {
    if (err) {
      return callback(err);
    }

    if (!data) {
      return callback(null, null);
    }

    let decoded;
    try {
      decoded = JSON.parse(data);
    } catch(e) {
      return callback(e);
    }

    callback(null, decoded);
  });
};

module.exports.remove = function removeSessionNamespace(params, callback) {
  let session_id = params.session_id;
  let namespace_id = params.namespace_id;

  redis.hdel(session_id, namespace_id, (err, remove_count) => {
    if (err) {
      return callback(err);
    }

    callback(null, remove_count);
  });
};

module.exports.set = function setSessionNamespace(params, callback) {
  let session_id = params.session_id;
  let namespace_id = params.namespace_id;
  let body = params.body;

  body._session = session_id;
  body._namespace = namespace_id;
  body._modified = (new Date()).toISOString()

  redis.hset(session_id, namespace_id, JSON.stringify(body), (err, count) => {
    if (err) {
      return callback(err);
    }

    callback(null, body);
  });
};
