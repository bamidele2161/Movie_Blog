const express = require("express");
const router = express.Router();
const {
  CreatePost,
  GetAllPosts,
  DeletePost,
  UpdatePost,
  GetAPost,
  GetAllPostsByUserId,
} = require("../controller/movie");
const authorizer = require("../middleware/auth");

router.get("/r", (req, res) => {
  return res.status(200).json({
    message: "testing route",
  });
});

router.post("/", authorizer, CreatePost);
router.get("/", GetAllPosts);
router.get("/user", authorizer, GetAllPostsByUserId);
router.get("/:postId", GetAPost);
router.put("/:postId", authorizer, UpdatePost);
router.delete("/:postId", authorizer, DeletePost);

module.exports = router;
