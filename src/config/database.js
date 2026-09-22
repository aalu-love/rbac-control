const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();

  for (const collection of collections) {
    await mongoose.connection.db.dropCollection(collection.name);
  }

  console.log("Database cleared successfully");
};

module.exports = { connectDB, clearDatabase };
