var mongoose = require('mongoose');

var urlModel = mongoose.model('URL', new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: Number,
    required: true
  }
}));

module.exports = {
  urlModel
};
