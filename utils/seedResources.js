const Resource = require("../models/Resource");

async function seedResources() {
    const resources = ["user", "post", "comment"];

    for (const resourceName of resources) {
        const resource = new Resource({ name: resourceName });
        await resource.save();
    }

    console.log("Resources seeded!");
}

module.exports = { seedResources };
