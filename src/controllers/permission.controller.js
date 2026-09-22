const { getUserPermissions } = require("../service/permission.service");

const getMyPermissions = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const permissions = await getUserPermissions(userId);

    if (!permissions) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      permissions,
    });
  } catch (error) {
    console.error("Get permissions error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMyPermissions,
};
