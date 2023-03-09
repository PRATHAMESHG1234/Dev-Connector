const express = require("express");

const router = express.Router();

//@route   GET api/post
//@description    test route
/// @access    Public

router.get("/", (req, res) => {
  res.send("User post route");
});

module.exports = router;
