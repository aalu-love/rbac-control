import { Role } from "../models/index.js";

const createRole = async ({ name, scopes = [] }) => {
  const existingRole = await Role.findOne({ name });

  if (existingRole) {
    throw new Error("Role already exists");
  }

  return Role.create({
    name,
    scopes,
  });
};

const getRoles = async () => {
  return Role.find().populate({
    path: "scopes",
    populate: {
      path: "resource",
    },
  });
};

const getRoleById = async (roleId) => {
  const role = await Role.findById(roleId).populate({
    path: "scopes",
    populate: {
      path: "resource",
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

const getRoleByName = async (name) => {
  return Role.findOne({ name }).populate({
    path: "scopes",
    populate: {
      path: "resource",
    },
  });
};

const updateRole = async (roleId, data) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (data.name) {
    const existingRole = await Role.findOne({
      name: data.name,
      _id: { $ne: roleId },
    });

    if (existingRole) {
      throw new Error("Role already exists");
    }
  }

  Object.assign(role, data);

  return role.save();
};

const deleteRole = async (roleId) => {
  const role = await Role.findByIdAndDelete(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

const assignScopes = async (roleId, scopeIds) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { scopes: scopeIds },
    { new: true },
  ).populate("scopes");

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

const addScope = async (roleId, scopeId) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { $addToSet: { scopes: scopeId } },
    { new: true },
  ).populate("scopes");

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

const removeScope = async (roleId, scopeId) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { $pull: { scopes: scopeId } },
    { new: true },
  ).populate("scopes");

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

const getRolesByNames = async (roleNames) => {
  const roles = await Role.find({ name: { $in: roleNames } });
  return roles;
};

export {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  assignScopes,
  addScope,
  removeScope,
  getRolesByNames,
};
