const Role = require("../models/Role");
const Scope = require("../models/Scope");

async function assignScopesToRoles() {
    const rPostScope = await Scope.findOne({ name: "r_post" });
    const rwPostScope = await Scope.findOne({ name: "rw_post" });
    const rwxPostScope = await Scope.findOne({ name: "rwx_post" });

    const rUserScope = await Scope.findOne({ name: "r_user" });
    const rwUserScope = await Scope.findOne({ name: "rw_user" });
    const rwxUserScope = await Scope.findOne({ name: "rwx_user" });

    const rCommentScope = await Scope.findOne({ name: "r_comment" });
    const rwCommentScope = await Scope.findOne({ name: "rw_comment" });
    const rwxCommentScope = await Scope.findOne({ name: "rwx_comment" });

    new Role({
        name: "superuser",
        scopes: [rwxPostScope._id, rwxUserScope._id, rwxCommentScope._id], // Superadmin gets full access
    }).save();

    const adminRole = new Role({
        name: "admin",
        scopes: [rwxPostScope._id, rwxCommentScope._id], // Admin gets full access for
    });

    const editorRole = new Role({
        name: "editor",
        scopes: [rwPostScope._id, rCommentScope], // Editor gets read and write access
    });

    const viewerRole = new Role({
        name: "viewer",
        scopes: [rPostScope._id], // Viewer gets full access
    });

    await adminRole.save();
    await editorRole.save();
    await viewerRole.save();

    console.log("Roles assigned scopes!");
}

module.exports = { assignScopesToRoles };
