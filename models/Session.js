const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  tutorName: { type: String, required: false },
  tutorEmail: { type: String, required: false },
  studentName: { type: String, required: false },
  studentEmail: { type: String, required: false },
  course: { type: String, required: false },
  date: { type: Date, required: false },
  sessionLink: { type: String, required: false },
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
