/* eslint no-console: 0 */

var path = require('path');
var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + '/app'));
app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
