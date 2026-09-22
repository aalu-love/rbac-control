import { Resource } from "../models/index.js";

const createResource = async ({ name }) => {
  const existingResource = await Resource.findOne({ name });

  if (existingResource) {
    throw new Error("Resource already exists");
  }

  return Resource.create({
    name,
  });
};

const getResources = async () => {
  return Resource.find();
};

const getResourceById = async (resourceId) => {
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  return resource;
};

const getResourceByName = async (name) => {
  return Resource.findOne({ name });
};

const updateResource = async (resourceId, data) => {
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (data.name) {
    const existingResource = await Resource.findOne({
      name: data.name,
      _id: { $ne: resourceId },
    });

    if (existingResource) {
      throw new Error("Resource already exists");
    }
  }

  Object.assign(resource, data);

  return resource.save();
};

const deleteResource = async (resourceId) => {
  const resource = await Resource.findByIdAndDelete(resourceId);

  if (!resource) {
    throw new Error("Resource not found");
  }

  return resource;
};

export {
  createResource,
  getResources,
  getResourceById,
  getResourceByName,
  updateResource,
  deleteResource,
};
