const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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

  hoursUsed: {
    type: Number,
  },

  hoursRemaining: {
    type: Number,
  },

  isTutor: {
    type: Boolean,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
