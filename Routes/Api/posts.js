const express = require("express");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const router = express.Router();

//@route   POST api/post
//@description    Create a post
/// @access    private

router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //check user with this enmail exits already

      let user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//@route   GET api/post
//@description    Get all post
/// @access    private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route   GET api/post/:id
//@description    Get all post
/// @access    private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});
//@route   GET api/post/:id
//@description    Get all post
/// @access    private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    //check user

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not Authorized" });
    }
    await post.deleteOne();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});

//@route   PUT api/post/like/:id
//@description    Like a post
/// @access    private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post is already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Name is required");
  }
});
//@route   PUT api/post/unlike/:id
//@description    remove Like from post
/// @access    private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post is already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length == 0
    ) {
      return res.status(400).json({ msg: "Post doesnt have any likes" });
    }

    // get index of like to be removed
    const itemId = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    console.log(itemId);

    post.likes.splice(itemId, 1);

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Name is required");
  }
});

//@route   POST api/posts/comment/:id
//@description    Createcomment a post
/// @access    private

router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findById(req.user.id).select("-password");
      let post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//@route   DELETE api/post/comment/:id/:comment_id
//@description    delete comment
/// @access    private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //get comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //make sure if comment exists

    if (!comment) {
      return res.status(404).json({ msg: "comment is not exists" });
    }

    //check user
    if (comment.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "user not authorized" });
    }

    //get index of comment
    const itemId = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    console.log(itemId);

    post.comments.splice(itemId, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
