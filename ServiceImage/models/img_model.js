const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  lien: {
    type: String,
    required: true,
  }
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;