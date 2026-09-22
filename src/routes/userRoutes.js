const express = require("express");
const { authorize } = require("../middleware/auth");

const router = express.Router();

// Route: Read users
router.get("/user", authorize("post", "read"), (req, res) => {
    res.send("Retrieved all user!");
});

// Route: Create a user
router.post("/user", authorize("post", "create"), (req, res) => {
    res.send("Created a user!");
});

// Route: Delete a user
router.delete("/user/:id", authorize("post", "delete"), (req, res) => {
    res.send(`Deleted user with ID: ${req.params.id}`);
});

module.exports = router;
