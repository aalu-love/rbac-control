const express = require("express");
const { authorize } = require("../middleware/auth");

const router = express.Router();

// Route: Read comments
router.get("/comment", authorize("r_comment"), (req, res) => {
    res.send("Retrieved all comment!");
});

// Route: Create a comment
router.post("/comment", authorize("rw_comment"), (req, res) => {
    res.send("Created a comment!");
});

// Route: Delete a comment
router.delete("/comment/:id", authorize("rwx_comment"), (req, res) => {
    res.send(`Deleted comment with ID: ${req.params.id}`);
});

module.exports = router;
