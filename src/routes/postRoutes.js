const express = require("express");
const { authorize } = require("../middleware/auth");

const router = express.Router();

// Route: Read posts
router.get("/posts", authorize("post", "read"), (req, res) => {
    return res.send("Retrieved all posts!");
});

// Route: Create a post
router.post("/posts", authorize("post", "create"), (req, res) => {
    return res.send("Created a post!");
});

// Route: Delete a post
router.delete("/posts/:id", authorize("post", "delete"), (req, res) => {
    return res.send(`Deleted post with ID: ${req.params.id}`);
});

module.exports = router;
