require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

// Seeders
const {
    seedResources,
    seedDatabase,
    seedRoleAndScope,
    seedRoleAndUser,
} = require("./utils/seed");

// Routes
const {
    authRouter,
    commentRouter,
    postRouter,
    userRouter,
} = require("./routes");
const { authenticate } = require("./middleware/auth");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/resource", authenticate, postRouter);
app.use("/api/resource", authenticate, userRouter);
app.use("/api/resource", authenticate, commentRouter);

app.get("/seeder", async (req, res) => {
    await seedResources(); // Seed all resources which is required
    await seedRoleAndScope(); // Seed all roles and scopes
    await seedRoleAndUser(); // Assign roles to users
    await assignRolesToUsers(); // Assign roles to users
    return res.send("success");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
