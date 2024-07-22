const express = require("express");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const Session = require("../models/Session");
const Doubt = require("../models/Doubt");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const jwt = require("jsonwebtoken");

const otpStore = {};

router.post("/enroll", (req, res) => {
  const { name, email, comments } = req.body;

  let mailOptions = {
    from: `ProLearner <${process.env.EMAIL_COMPANY_USERNAME}>`,
    to: process.env.EMAIL_ADMIN_USERNAME,
    subject: "Online Tutoring Required",
    text: "",
    html: `<b>ProLearner Student's Name: ${name} Students's email: ${email} comments: ${comments}</b>`,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_COMPANY_USERNAME,
      pass: process.env.EMAIL_COMPANY_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`[+] ${error} [+]`);
      res.status(500).json({
        message: "[+] Failed! Please Try Again [+]",
      });
    } else {
      console.log("[+] Message sent: %s [+]", info.messageId);
      res.json({
        message: "[+] Success [+]",
      });
    }
  });
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  let existingUser = await Tutor.findOne({ email });
  if (!existingUser) {
    existingUser = await Student.findOne({ email });
  }
  if (existingUser) {
    return res.status(400).json({ message: "[+] User already exists [+]" });
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  let mailOptions = {
    from: `ProLearner <${process.env.EMAIL_COMPANY_USERNAME}>`,
    to: email,
    subject: "Email Verification | ProLearner",
    text: "",
    html: `<b>OTP For Email Verification is: ${otp} </b>`,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_COMPANY_USERNAME,
      pass: process.env.EMAIL_COMPANY_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`[+] ${error} [+]`);
      res.status(500).json({
        message: "[+] Failed! Please Try Again [+]",
      });
    } else {
      console.log("[+] Message sent: %s [+]", info.messageId);
      res.json({
        message: "p+] Success [+]",
      });
    }
  });
});

router.post("/register", async (req, res) => {
  const { name, email, otp, password, isTutor } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    try {
      const existingUser = isTutor
        ? await Tutor.findOne({ email })
        : await Student.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "[+] User already exists [+]" });
      }
      const newUser = isTutor
        ? new Tutor({
            name: name,
            email: email,
            password: password,
            hoursCredited: 0,
            isTutor: isTutor,
          })
        : new Student({
            name: name,
            email: email,
            password: password,
            hoursUsed: 0,
            hoursRemaining: 1,
            isTutor: isTutor,
          });
      await newUser.save();
      res
        .status(201)
        .json({ message: "[+] Registration Successful, Thank You! [+]" });
    } catch (error) {
      console.log(`[+] User Registration Failed ${error} [+]`);
      res.status(500).json({ message: "[+] Error! registering user [+]" });
    }
  } else {
    res.status(400).json({ message: "[+] Invalid OTP [+]" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Tutor.findOne({ email });
    if (!user) {
      user = await Student.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ message: "[+] User Not Found! [+]" });
    }

    const isMatch = user.password === password;
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "[+] Invalid email or password [+]" });
    }

    const accessToken = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          isTutor: user.isTutor,
        },
      },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({
      isTutor: user.isTutor,
      accessToken,
      message: "[+] Login successful [+]",
    });
  } catch (error) {
    console.log(`[+] User Login Failed ${error} [+]`);
    res.status(500).json({ message: "[+] Error logging in [+]", error });
  }
});

router.get("/current", validateToken, async (req, res) => {
  const { email, isTutor } = req.user;
  let user = null;
  if (isTutor) {
    user = await Tutor.findOne({ email });
  } else {
    user = await Student.findOne({ email });
  }
  if (!user) {
    return res.status(404).json({ message: "[+] User Not Found! [+]" });
  }
  res.json(user);
});

router.get("/student/session-details", validateToken, async (req, res) => {
  if (req.user.isTutor) {
    res.status(400).json({ message: "[+] Not Authorized [+]" });
    return;
  }
  const { email } = req.user;
  let sessionDetails = await Session.findOne({ studentEmail: email }).sort({
    date: 1,
  });
  res.json(sessionDetails);
});

router.get("/tutor/session-details", validateToken, async (req, res) => {
  if (!req.user.isTutor) {
    res.status(400).json({ message: "[+] Not Authorized [+]" });
    return;
  }
  const { email } = req.user;
  let sessionDetails = await Session.findOne({ tutorEmail: email }).sort({
    date: 1,
  });
  res.json(sessionDetails);
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword, otp } = req.body;
  let user = await Tutor.findOne({ email });
  if (!user) {
    user = await Student.findOne({ email });
  }
  if (!user) {
    return res.status(404).json({ message: "[+] User Not Found! [+]" });
  }

  if (otpStore[email] && otpStore[email] === otp) {
    try {
      delete otpStore[email];
      user.password = newPassword;
      await user.save();
      res
        .status(200)
        .json({ message: "[+] Password updated successfully [+]" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "[+] Something went wrong! Please Try Again [+]" });
    }
  } else {
    res.status(400).json({ message: "[+] Invalid OTP [+]" });
  }
});

router.post("/post-doubt", validateToken, async (req, res) => {
  if (req.user.isTutor) {
    res.status(400).json({ message: "[+] Not Authorized [+]" });
    return;
  }
  const { doubt, timestamp } = req.body;
  const user = req.user;
  try {
    const dt = new Doubt({
      studentEmail: req.user.email,
      doubt: doubt,
      timestamp: timestamp,
    });
    await dt.save();
    res.status(200).json({ message: "[+] Doubt Posted Successfully [+]" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
