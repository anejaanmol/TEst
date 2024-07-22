const mongoose = require("mongoose");

const DoubtSession = new mongoose.Schema({
  studentEmail: { type: String, required: false },
  doubt: { type: String, required: false },
  timestamp: { type: String, required: false },
});

const Doubt = mongoose.model("Doubt", DoubtSession);
module.exports = Doubt;
