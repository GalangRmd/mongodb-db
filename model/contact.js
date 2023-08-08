const mongoose = require("mongoose");

// membuat schema
const schema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    noHP: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  }
);

const Contact = mongoose.model('Contact', schema);

module.exports = Contact;