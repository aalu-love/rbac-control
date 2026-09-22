import { User } from "../models/index.js";

const createUser = async ({ username, password, roles = [] }) => {
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const user = await User.create({
    username,
    password,
    roles,
  });

  return user;
};

const getUsers = async () => {
  return User.find().populate("roles").select("-password");
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .populate("roles")
    .select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const getUserByUsername = async (username) => {
  return User.findOne({ username }).populate("roles");
};

const updateUser = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.username) {
    const existingUser = await User.findOne({
      username: data.username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }
  }

  Object.assign(user, data);

  return user.save();
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const assignRoles = async (userId, roleIds) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { roles: roleIds },
    { new: true },
  ).populate("roles");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const removeRole = async (userId, roleId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { roles: roleId } },
    { new: true },
  ).populate("roles");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const comparePassword = async (user, password) => {
  return user.comparePassword(password);
};

export {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  assignRoles,
  removeRole,
  comparePassword,
};
