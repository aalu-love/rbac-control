const { User } = require("../models/index.js");
const redis = require("../config/redis.js");

const getPermissionKey = (userId) => {
  return `rbac:user:${userId}`;
};

const resolvePermissions = (user) => {
  const permissions = new Set();

  for (const role of user.roles ?? []) {
    for (const scope of role.scopes ?? []) {
      const resource = scope.resource?.name?.toLowerCase();

      if (!resource) continue;

      for (const action of scope.actions ?? []) {
        permissions.add(`${resource}:${action}`);
      }
    }
  }

  return [...permissions];
};

const getUserPermissions = async (userId) => {
  const key = getPermissionKey(userId);

  // 1. Try Redis first
  const cachedPermissions = await redis.smembers(key);

  if (cachedPermissions.length > 0) {
    return cachedPermissions;
  }

  // 2. Cache miss → MongoDB
  const user = await User.findById(userId)
    .populate({
      path: "roles",
      populate: {
        path: "scopes",
        populate: {
          path: "resource",
        },
      },
    })
    .lean();

  if (!user) {
    return null;
  }

  // 3. Resolve permissions
  const permissions = resolvePermissions(user);

  // 4. Store in Redis
  if (permissions.length > 0) {
    await redis.sadd(key, permissions);

    // Optional safety TTL
    await redis.expire(key, 60 * 60);
  }

  return permissions;
};

const hasPermission = async (userId, resource, action) => {
  const permission = `${resource.toLowerCase()}:${action}`;

  const permissions = await getUserPermissions(userId);

  if (!permissions) {
    return false;
  }

  return permissions.includes(permission);
};

const clearUserPermissions = async (userId) => {
  await redis.del(getPermissionKey(userId));
};

module.exports = {
  getUserPermissions,
  hasPermission,
  clearUserPermissions,
};
