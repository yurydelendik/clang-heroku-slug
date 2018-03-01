var qs = require('querystring');

function notAllowed(res) {
  res.writeHead(503);
  res.end();
}

function showError(res, err) {
  res.writeHead(501);
  res.end(`<pre>${err.toString()}</pre>`);
}

function readFormData(request, type, callback) {
  var body = '';

  request.on('data', function (data) {
    body += data;

    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
      request.connection.destroy();
  });

  request.on('end', function () {
    try {
      const result = type == "json" ? JSON.parse(body) : qs.parse(body);
      callback(null, result);
    } catch (ex) {
      callback(ex);
    }
  });
}

module.exports = function handleRequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');

  if (req.method == "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url == "/service.php") {
    if (req.method != "POST") return notAllowed(res);
    readFormData(req, "form", (err, post) => {
      if (err) return showError(res, err);
      if (post.action != "build") return notAllowed(res);
      let input;
      try {
        input = JSON.parse(post.input);
      } catch (e) {
        return showError(res, e);
      }
      require('./build')(input, (err, result) => {
        if (err) return showError(res, err);
        res.setHeader('Content-type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(result));
      });
    });
    return;
  }

  if (req.url == "/build") {
    if (req.method != "POST") return notAllowed(res);
    readFormData(req, "json", (err, input) => {
      if (err) return showError(res, err);
      require('./build')(input, (err, result) => {
        if (err) return showError(res, err);
        res.setHeader('Content-type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(result));
      });
    });
    return;
  }

  res.writeHead(404);
  res.end();
};
