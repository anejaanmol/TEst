const express = require("express");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const Session = require("../models/Session");
const Doubt = require("../models/Doubt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/auth", (req, res) => {
  const { uid, pass } = req.body;
  if (uid === process.env.ADMIN_UID && pass === process.env.ADMIN_PASS) {
    const accessToken = jwt.sign(
      {
        user: {
          email: uid,
        },
      },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    res.json({ message: "[+] Access Granted [+]", accessToken });
  } else {
    res.status(400).json({ message: "[+] Access Denied [+]" });
  }
});

router.get("/data", validateToken, async (req, res) => {
  let tutors = [];
  let students = [];
  let sessions = [];
  let doubts = [];
  try {
    students = await Student.find({}).select(
      "-password -phone -hoursUsed -isTutor"
    );
    tutors = await Tutor.find({}).select("-password -phone -isTutor");
    const today = Date.now();
    await Session.deleteMany({ date: { $lt: today } });
    sessions = await Session.find({}).sort({ date: 1 });
    doubts = await Doubt.find({});
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
  res.json({
    name: "ProLearner",
    tutors: tutors,
    students: students,
    sessions: sessions,
    doubts: doubts,
  });
});

router.post("/schedule-session", validateToken, async (req, res) => {
  const { studentEmail, tutorEmail, course, date, sessionLink } = req.body;

  let student = await Student.findOne({ email: studentEmail });
  let tutor = await Tutor.findOne({ email: tutorEmail });

  if (!student) {
    res.status(404).json({ message: "[+] Student Not Found [+]" });
    return;
  }

  if (!tutor) {
    res.status(404).json({ message: "[+] Tutor Not Found [+]" });
    return;
  }

  if (student.hoursRemaining <= 0) {
    res.status(404).json({ message: "[+] Student Have 0 Remaining Hours [+]" });
    return;
  }

  const newSession = new Session({
    studentEmail: student.email,
    studentName: student.name,
    tutorEmail: tutor.email,
    tutorName: tutor.name,
    course: course,
    date: new Date(date),
    sessionLink: sessionLink,
  });

  await newSession.save();
  res.status(201).json({ message: "[+] Session Scheduled Successfully [+]" });
});

router.post("/transact", validateToken, async (req, res) => {
  const { studentEmail, tutorEmail, hours } = req.body;
  let tutor = await Tutor.findOne({ email: tutorEmail });
  let student = await Student.findOne({ email: studentEmail });
  try {
    tutor.hoursCredited += parseFloat(hours);
    student.hoursUsed = student.hoursUsed + parseFloat(hours);
    student.hoursRemaining = student.hoursRemaining - parseFloat(hours);
    await tutor.save();
    await student.save();
    await Session.findOneAndDelete({
      studentEmail: studentEmail,
      tutorEmail: tutorEmail,
    }).sort({ date: 1 });
    res.json({ message: "[+] Hours Transcation Successful [+]" });
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
});

module.exports = router;
