require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");

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
app.get("/healthz", (req, res) => {
  res.status(200).json({ message: "OK", date: new Date().toISOString() });
});
app.use("/api/auth", authRouter);
// app.use("/api/resource", authenticate, postRouter);
// app.use("/api/resource", authenticate, userRouter);
// app.use("/api/resource", authenticate, commentRouter);

app.use("/api/resource", authenticate, [
  postRouter, userRouter, commentRouter
]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
