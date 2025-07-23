const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { populate } = require("../models/Role");
const { SCOPE } = require("../config/scope");

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

const authorize = (scopeName) => {
    return async (req, res, next) => {
        const { id: userId } = req.user; // Assume userId is set in the request after authentication
        const user = await User.findById(userId).populate({
            path: "roles",
            populate: {
                path: "scopes",
                populate: {
                    path: "resource",
                },
            },
        });

        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const resourceName = scopeName.split("_")[1];
        const actionName = scopeName.split("_")[0];

        // Check if the user has access to the resource and the required permission
        const hasAccess = user.roles.some((role) =>
            role.scopes.some(
                (scope) =>
                    scope.resource.name === resourceName &&
                    (scope.name === scopeName ||
                        scope.name.startsWith(actionName)),
            ),
        );

        if (!hasAccess) {
            return res
                .status(403)
                .json({
                    message:
                        "Forbidden: Insufficient permissions or no access to resource",
                });
        }

        next();
    };
};

const scopeResourceAccess = (scopeName) => {
    const [actionName, resourceName] = scopeName.split("_");

    // if ()

    console.log(SCOPE[actionName]);
};

module.exports = { authenticate, authorize };
