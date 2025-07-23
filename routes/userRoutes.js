const express = require("express");
const { authorize } = require("../middleware/auth");

const router = express.Router();

// Route: Read users
router.get("/user", authorize("r_user"), (req, res) => {
    res.send("Retrieved all user!");
});

// Route: Create a user
router.post("/user", authorize("rw_user"), (req, res) => {
    res.send("Created a user!");
});

// Route: Delete a user
router.delete("/user/:id", authorize("rwx_user"), (req, res) => {
    res.send(`Deleted user with ID: ${req.params.id}`);
});

module.exports = router;
