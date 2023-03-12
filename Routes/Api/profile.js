const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { response } = require("express");

//@route   GET api/Profile/me
//@description    get current user profile route
/// @access    Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ errors: "there is no profile for user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route   POST api/Profile/me
//@description    Create update user profile route
/// @access    privet

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log("req.body", req.body);

    const {
      education,
      experience,
      website,
      location,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;
    // Building Profile object
    const profileFeilds = {};

    profileFeilds.user = req.user.id;
    if (education) profileFeilds.education = education;

    if (experience) profileFeilds.experience = experience;

    if (website) profileFeilds.website = website;

    if (location) profileFeilds.location = location;

    if (status) profileFeilds.status = status;

    if (githubusername) profileFeilds.githubusername = githubusername;

    if (skills) {
      profileFeilds.skills = skills.split(",").map((skill) => skill.trim());
    }

    // console.log(profileFeilds.skills);
    //

    //Build social object
    profileFeilds.social = {};

    if (youtube) profileFeilds.social.youtube = youtube;

    if (twitter) profileFeilds.social.twitter = twitter;

    if (facebook) profileFeilds.social.facebook = facebook;

    if (linkedin) profileFeilds.social.linkedin = linkedin;

    if (instagram) profileFeilds.social.instagram = instagram;
    console.log(profileFeilds);
    try {
      //create profile

      let profile = new Profile(profileFeilds);

      await profile.save();
      profile = Profile.findOne({
        user: req.user.id,
      });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );

        return res.json(profile);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//@route   GET api/Profile
//@description    Get All profile route
/// @access    Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
    console.log("profile", profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//@route   GET api/Profile/user/:user_id
//@description    Get  profile by user id route
/// @access    Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      res.status(400).send({ msg: "There is no Profile" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      res.status(400).send({ msg: "There is no Profile" });
    } else {
      res.status(500).send("Server error");
    }
  }
});

//@route   DELETE api/Profile
//@description    Delete profile,user ,post route
/// @access    Privet

router.delete("/", auth, async (req, res) => {
  try {
    //Remove user post

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //remove User

    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user deleted" });
  } catch (error) {
    console.error("error is", error.message);
    res.status(500).send("Server error");
  }
});

//@route   Put api/Profile/experience
//@description    Add profile experience route
/// @access    Privet

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Nserver error");
    }
  }
);

//@route   DELETE api/Profile/experience/:exp_id
//@description    Delete profile experience route
/// @access    Privete

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const itemId = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    console.log(itemId);

    profile.experience.splice(itemId, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Nserver error");
  }
});
//@route   Put api/Profile/education
//@description    Add profile experience route
/// @access    Privet

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "field of studyis required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newedu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newedu);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Nserver error");
    }
  }
);

//@route   DELETE api/Profile/education/:edu_id
//@description    Delete profile experience route
/// @access    Privete

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const itemId = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    console.log(itemId);

    profile.education.splice(itemId, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Nserver error");
  }
});

//@route   GET api/Profile/github/:username
//@description    Get user repos from github route
/// @access    public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",

      headers: {
        "User-Agent": "Dev-Connector",
      },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error.message);
      }
      if (response.statusCode !== 200) {
        return res.status(404).send({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Nserver error");
  }
});

module.exports = router;
