const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { User, Role, Resource, Scope } = require("../../models");

require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // -------------------------
    // 1. Resources
    // -------------------------

    const postResource = await Resource.findOneAndUpdate(
      { name: "post" },
      { name: "post" },
      { upsert: true, new: true },
    );

    const userResource = await Resource.findOneAndUpdate(
      { name: "user" },
      { name: "user" },
      { upsert: true, new: true },
    );

    // -------------------------
    // 2. Scopes
    // -------------------------

    const postRead = await Scope.findOneAndUpdate(
      { name: "post_read" },
      {
        name: "post_read",
        resource: postResource._id,
        actions: ["read"],
      },
      { upsert: true, new: true },
    );

    const postWrite = await Scope.findOneAndUpdate(
      { name: "post_write" },
      {
        name: "post_write",
        resource: postResource._id,
        actions: ["create", "update", "delete"],
      },
      { upsert: true, new: true },
    );

    const userRead = await Scope.findOneAndUpdate(
      { name: "user_read" },
      {
        name: "user_read",
        resource: userResource._id,
        actions: ["read"],
      },
      { upsert: true, new: true },
    );

    // -------------------------
    // 3. Roles
    // -------------------------

    const userRole = await Role.findOneAndUpdate(
      { name: "user" },
      {
        name: "user",
        scopes: [postRead._id],
      },
      { upsert: true, new: true },
    );

    const adminRole = await Role.findOneAndUpdate(
      { name: "admin" },
      {
        name: "admin",
        scopes: [postRead._id, postWrite._id, userRead._id],
      },
      { upsert: true, new: true },
    );

    // -------------------------
    // 4. Users
    // -------------------------

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: hashedPassword,
        roles: [adminRole._id],
      },
      { upsert: true, new: true },
    );

    await User.findOneAndUpdate(
      { username: "user" },
      {
        username: "user",
        password: hashedPassword,
        roles: [userRole._id],
      },
      { upsert: true, new: true },
    );

    console.log("RBAC seed completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeder failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
