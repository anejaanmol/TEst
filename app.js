const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const db = require('./config/db');

const app = express();
app.use(express.json());
app.use(express.static("src"));

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.get("/login-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/login_signup_up.html"));
});

app.get("/plan", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/plan.html"));
});

app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/admin-login.html"));
});

app.get("/student", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/student.html"));
});

app.get("/tutor", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/teacher.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "./src/admin.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[+] ProLearner Server is Running on: http://localhost:${port} [+]`);
});
