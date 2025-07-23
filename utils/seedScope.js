const Resource = require("../models/Resource");
const Scope = require("../models/Scope");

async function seedScopes() {
    const resources = await Resource.find();

    for (const resource of resources) {
        const scopes = [
            { name: `r_${resource.name}`, actions: ["read"] },
            { name: `rw_${resource.name}`, actions: ["read", "write"] },
            {
                name: `rwx_${resource.name}`,
                actions: ["read", "write", "delete"],
            },
        ];

        for (const scope of scopes) {
            const newScope = new Scope({
                name: scope.name,
                resource: resource._id,
                actions: scope.actions,
            });
            await newScope.save();
        }
    }

    console.log("Scopes seeded!");
}

module.exports = {
    seedScopes,
};
