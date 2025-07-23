require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

// Seeders
const { seedResources } = require("./utils/seedResources");
const { seedScopes } = require("./utils/seedScope");
const { seedDatabase } = require("./routes");
const { assignScopesToRoles } = require("./utils/seedRoleAndScope");
const { assignRolesToUsers } = require("./utils/seedRoleAndUser");

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { authenticate } = require("./middleware/auth");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/resource", authenticate, postRoutes);
app.use("/api/resource", authenticate, userRoutes);
app.use("/api/resource", authenticate, commentRoutes);

app.get("/seeder", async (req, res) => {
    await seedResources();
    await seedScopes();
    await assignScopesToRoles();
    await assignRolesToUsers();
    return res.send("success");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
