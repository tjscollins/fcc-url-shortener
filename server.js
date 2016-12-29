var express = require('express');
var mongoose = require('mongoose');
var validator = require('validator');
var {urlModel} = require('./db/models/urls');

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/URLs';

mongoose.Promise = global.Promise;
mongoose.connect(DB);

var app = express()

app.get('/new/:url*', function(req, res) {
  if (validator.isURL(req.params.url + req.params[0])) {
    res.send(JSON.stringify(shortenURL(req)));
  } else {
    res.send(JSON.stringify({error: 'Please provide a valid URL'}));
  }

});

app.get('/:key', (req, res) => {
  console.log('Looking for', req.params.key);
  var url = urlModel
    .find({
    key: parseInt(req.params.key)
  })
    .then((url) => {
      if (!url) {
        res.sendStatus(404);
      }
      console.log(url);
      res.redirect(301, url[0].original_url);
    })
    .catch((err) => {
      res.sendStatus(404);
      console.log('Error', err);
    })
});

app.listen(PORT, function() {
  console.log('Server is listening on port 3000!')
});

function shortenURL(req) {
  var rand = Math.floor(Math.random() * 10000);
  var shortURL = req.protocol + '://' + req.hostname + `/${rand}`;
  var url = new urlModel({
    original_url: req.params[0]
      ? req.params.url + req.params[0]
      : req.protocol + '://' + req.params.url,
    key: rand
  });
  url.save();
  return {
    original_url: req.params[0]
      ? req.params.url + req.params[0]
      : req.protocol + '://' + req.params.url,
    short_url: shortURL
  }
}
