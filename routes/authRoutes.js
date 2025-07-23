const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password, roles } = req.body;

    try {
        // Find role in the database
        const roleDoc = await Role.find({}, "name").where({
            name: roles,
        });
        if (!roleDoc) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const roleIDs = roleDoc.map((r) => r._id);

        // Create new user
        const user = new User({
            username,
            password,
            roles: [...roleIDs], // Save the role ID
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            },
        );
        return res.json({
            token,
            username: user.username,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getallrole", async (req, res) => {
    const { roles } = req.body;

    try {
        // Find role in the database
        const roleDoc = await Role.find({}, "name").where({
            name: roles,
        });
        if (!roleDoc) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        res.status(201).json({
            roles: roleDoc,
            message: "ok",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

module.exports = router;
