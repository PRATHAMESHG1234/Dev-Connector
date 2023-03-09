const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
//@route   POST api/users
//@description    register user
/// @access    Public

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", " please inclucde valide email").isEmail(),
    check("password", "please enter password more than 6 characters").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      //see if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //Get user Gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //encrypt the passsword

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken

      res.send("user registered succesfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
