const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const saltRounds = 12;

router.post("/sign-up", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email });

    if (userInDatabase) {
      return res.status(409).json({ err: "email already taken." });
    }

    const user = await User.create({
      email: req.body.email,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneCountry: req.body.phoneCountry,
      phoneNumber: req.body.phoneNumber,
      userType: req.body.userType,
      profilePhoto: req.body.profilePhoto,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      countryOfResidence: req.body.countryOfResidence,
    });

    const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id, userType: user.userType };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
