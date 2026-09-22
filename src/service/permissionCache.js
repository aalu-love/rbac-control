const redis = require("../config/redis");

const getPermissionKey = (userId) => {
  return `rbac:user:${userId}`;
};

const cachePermissions = async (userId, permissions) => {
  const key = getPermissionKey(userId);

  // Remove old permissions
  await redis.del(key);

  if (permissions.length > 0) {
    await redis.sadd(key, permissions);
  }
};

const hasPermission = async (userId, permission) => {
  const key = getPermissionKey(userId);

  return redis.sismember(key, permission);
};

const clearPermissions = async (userId) => {
  await redis.del(getPermissionKey(userId));
};

module.exports = {
  cachePermissions,
  hasPermission,
  clearPermissions,
};
