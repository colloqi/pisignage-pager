/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var path = require('path');
var compression = require('compression');
var serveStatic = require('serve-static');

var app = express();

app.use(compression());

app.use(function(req, res, next) {
    if (req.hostname === 'localhost') {
        req.url = req.url.replace("/app/pager", "/");
    }
    next();
});


app.use(serveStatic(path.join(__dirname,'../static')));

function handleError(res, error) {
    console.error(error);
    //return res.status(500).end(`Internal Server Error\n\n${error}`);
    res.writeHead(500);
    res.end("Internal Server Error\n\n${error}");
}

/*
function setHeaders(res, file) {
    if (file.includes(`${path.sep}rev${path.sep}`)) {
        res.setHeader('Cache-Control', 'max-age=31536000');
    } else {
        res.setHeader('Cache-Control', 'max-age=3600');
    }
}
*/

/*
app.set('view engine', 'jade');
app.set('views', path.join(__dirname,'../static'));

app.get('/efle3r', function(req,res) {
    res.render('index', {});
})
*/

module.exports = app;
