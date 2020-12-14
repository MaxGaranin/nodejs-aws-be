var mcache = require('memory-cache');

const cache = (duration, recipient) => {
  return (req, res, next) => {
    if (req.method === 'GET' && req.originalUrl.split('/')[1] === recipient) {
      let key = '__express__' + req.originalUrl;
      let cachedBody = mcache.get(key);
      if (cachedBody) {
        res.send(cachedBody);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        };
        next();
      }
    }
  };
};

module.exports = cache;
