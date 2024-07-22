const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Student = require("../models/Student");
const jwt = require('jsonwebtoken');

const storeItems = new Map([
  [1, { priceInCents: 29900, name: "2 Months Subscription", hours: 1440 }],
  [2, { priceInCents: 36900, name: "3 Months Subscription", hours: 2160 }],
  [3, { priceInCents: 99900, name: "12 Months Subscription", hours: 8640 }],
]);

router.post("/checkout", validateToken, async (req, res) => {
  try {
    let storeItem = null;
    const { email } = req.user;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: 1,
        };
      }),
      success_url: `${process.env.SERVER_URL}/success.html?hours=${
        storeItem.hours
      }&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.SERVER_URL}/failed.html`,
    });

    const accessToken = jwt.sign(
      {
        user: req.user,
      },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "24h",
      }
    );
    res.json({ url: session.url, accessToken });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/success", validateToken, async (req, res) => {
  if (req.body.email === req.user.email) {
    try {
      const student = await Student.findOne({ email: req.body.email });
      if (!student) {
        return res.status(404).json({ message: "[+] Student not found [+]" });
      }
      student.hoursRemaining += parseFloat(req.body.hours);
      await student.save();
      res.json(student);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: "[+] Something Went Wrong [+]" });
  }
});

module.exports = router;
