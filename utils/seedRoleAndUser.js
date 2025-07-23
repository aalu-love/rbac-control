const User = require("../models/User");
const Role = require("../models/Role");

async function assignRolesToUsers() {
    const adminRole = await Role.findOne({ name: "admin" });
    const editorRole = await Role.findOne({ name: "editor" });
    const viewerRole = await Role.findOne({ name: "viewer" });

    new User({
        username: "admin",
        password: "password123",
        roles: [adminRole._id],
    }).save();

    new User({
        username: "editor",
        password: "password123",
        roles: [editorRole._id, viewerRole._id],
    }).save();

    new User({
        username: "viewer",
        password: "password123",
        roles: [viewerRole._id],
    }).save();

    new User({
        username: "superuser",
        password: "password123",
        roles: [adminRole._id, editorRole._id, viewerRole._id],
    }).save();

    console.log("User assigned roles!");
}

module.exports = { assignRolesToUsers };
