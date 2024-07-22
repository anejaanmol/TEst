const mongoose = require("mongoose");

const Session = new mongoose.Schema({
  studentName: { type: String, required: false },
  studentEmail: { type: String, required: false },
  course: { type: String, required: false },
  date: { type: Date, required: false },
  sessionLink: { type: String, required: false },
});

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: false,
  },

  password: {
    type: String,
    required: true,
  },

  hoursCredited: {
    type: Number,
  },

  isTutor: {
    type: Boolean,
    required: true,
  }
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
