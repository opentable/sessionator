const redis = require('../redis.js');

module.exports.get = function getSession(params, callback) {
  let session_id = params.session_id;
  let namespaces = params.namespaces || [];

  if (namespaces.length) {
    redis
      .multi()
      .hkeys(session_id)
      .hmget(session_id, namespaces)
      .exec((err, data) => {
        if (err) {
          return callback(err);
        }

        const [list, raw_namespaces] = data;

        let namespaces = {};

        for (let namespace of raw_namespaces) {
          let decoded = JSON.parse(namespace);
          if (!decoded) {
            // Tried to get a invalid namespace
            continue;
          }
          namespaces[decoded._namespace] = decoded;
        }

        callback(null, Object.assign(namespaces, {
          _session: session_id,
          _namespaces: list
        }));
      });
  } else {
    redis.hkeys(session_id, (err, list) => {
      if (err) {
        return callback(err);
      }

      callback(null, {
        _session: session_id,
        _namespaces: list
      });
    })
  }
};

module.exports.remove = function removeSession(params, callback) {
  let session_id = params.session_id;

  redis.del(session_id, (err, remove_count) => {
    if (err) {
      return callback(err);
    }

    callback(null, remove_count);
  });
};
