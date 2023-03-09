const express = require("express");

const router = express.Router();

//@route   GET api/Auth
//@description    test route
/// @access    Public

router.get("/", (req, res) => {
  res.send("User Auth route");
});

module.exports = router;
