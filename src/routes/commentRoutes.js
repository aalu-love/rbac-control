const express = require("express");
const { authorize } = require("../middleware/auth");

const router = express.Router();

// Route: Read comments
router.get("/comment", authorize("post", "read"), (req, res) => {
    res.send("Retrieved all comment!");
});

// Route: Create a comment
router.post("/comment", authorize("post", "create"), (req, res) => {
    res.send("Created a comment!");
});

// Route: Delete a comment
router.delete("/comment/:id", authorize("post", "delete"), (req, res) => {
    res.send(`Deleted comment with ID: ${req.params.id}`);
});

module.exports = router;
