const express = require("express");

const router = express.Router();

//@route   GET api/Profile
//@description    test route
/// @access    Public

router.get("/", (req, res) => {
  res.send("User Profile route");
});

module.exports = router;
