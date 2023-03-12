const express = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
//@route   GET api/auth
//@description    test route
/// @access    Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route   POST api/auth
//@description    Authinticate user & get token
/// @access    Public

router.post(
  "/",
  [
    check("email", " please inclucde valide email").isEmail(),
    check("password", "please enter password more than 6 characters").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      //see if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalied Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalied Credentials" }] });
      }
      //Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
