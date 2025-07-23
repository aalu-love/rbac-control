const Role = require("../models/Role");
const Permission = require("../models/Permission");

const seedDatabase = async () => {
    const permissions = [
        {
            name: "manage_users",
            capabilities: ["create", "read", "update", "delete"],
        },
        {
            name: "manage_posts",
            capabilities: ["create", "read", "update", "delete"],
        },
    ];

    const createdPermissions = await Permission.insertMany(permissions);

    const roles = [
        {
            name: "Admin",
            permissions: createdPermissions.map((perm) => perm._id),
        },
        { name: "Editor", permissions: [createdPermissions[1]._id] },
    ];

    await Role.insertMany(roles);
    console.log("Database seeded successfully");
    process.exit();
};

module.exports = {
    seedDatabase,
};
