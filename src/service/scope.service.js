import { Scope } from "../models/index.js";

const createScope = async ({ name, resource, actions = [] }) => {
  const existingScope = await Scope.findOne({ name });

  if (existingScope) {
    throw new Error("Scope already exists");
  }

  return Scope.create({
    name,
    resource,
    actions,
  });
};

const getScopes = async () => {
  return Scope.find().populate("resource");
};

const getScopeById = async (scopeId) => {
  const scope = await Scope.findById(scopeId).populate("resource");

  if (!scope) {
    throw new Error("Scope not found");
  }

  return scope;
};

const getScopeByName = async (name) => {
  return Scope.findOne({ name }).populate("resource");
};

const getScopesByResource = async (resourceId) => {
  return Scope.find({
    resource: resourceId,
  }).populate("resource");
};

const updateScope = async (scopeId, data) => {
  const scope = await Scope.findById(scopeId);

  if (!scope) {
    throw new Error("Scope not found");
  }

  if (data.name) {
    const existingScope = await Scope.findOne({
      name: data.name,
      _id: { $ne: scopeId },
    });

    if (existingScope) {
      throw new Error("Scope already exists");
    }
  }

  Object.assign(scope, data);

  return scope.save();
};

const deleteScope = async (scopeId) => {
  const scope = await Scope.findByIdAndDelete(scopeId);

  if (!scope) {
    throw new Error("Scope not found");
  }

  return scope;
};

const addAction = async (scopeId, action) => {
  const scope = await Scope.findByIdAndUpdate(
    scopeId,
    { $addToSet: { actions: action } },
    { new: true },
  );

  if (!scope) {
    throw new Error("Scope not found");
  }

  return scope;
};

const removeAction = async (scopeId, action) => {
  const scope = await Scope.findByIdAndUpdate(
    scopeId,
    { $pull: { actions: action } },
    { new: true },
  );

  if (!scope) {
    throw new Error("Scope not found");
  }

  return scope;
};

export {
  createScope,
  getScopes,
  getScopeById,
  getScopeByName,
  getScopesByResource,
  updateScope,
  deleteScope,
  addAction,
  removeAction,
};
