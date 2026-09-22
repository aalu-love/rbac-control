const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Role = require("../models/Role");
const { getUserByUsername } = require("../service/User.service");
const { getRolesByNames } = require("../service/role.service");

const register = async (req, res) => {
  try {
    const { username, password, user_roles } = req.body;

    // Check if user already exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    // Find requested roles
    const roles = await getRolesByNames(user_roles);

    // Make sure all requested roles exist
    if (roles.length !== user_roles.length) {
      return res.status(400).json({
        message: "One or more invalid roles specified",
      });
    }

    const roleIds = roles.map((role) => role._id);

    const user = await User.create({
      username,
      password,
      roles: roleIds,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({}).select("_id name").lean();

    return res.status(200).json({
      roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  getRoles,
};
