import { MongoClient } from "mongodb";
import "dotenv/config";
import express from "express";
import frameworks from "../config/frameworks.js";
import languages from "../config/languages.js";

const router = express.Router();

const collectionRouter = router.get("/", async (req, res) => {
  let client;

  try {
    // Create connection inside the route handler
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("test");
    const users = await db.collection("users").find({}).toArray();

    res.render("collection", {
      title: "Developer Collection",
      users: users,
      languages: languages,
      frameworks: frameworks,
    });
  } catch (error) {
    console.error("Database error in collection route:", error.message);

    res.status(500).render("collection", {
      title: "Developer Collection",
      error: "Unable to load profiles at this time. Please try again later.",
      users: [],
      languages: languages,
      frameworks: frameworks,
    });
  } finally {
    // Always close the connection
    if (client) {
      await client
        .close()
        .catch((err) => console.error("Error closing connection:", err));
    }
  }
});

export default collectionRouter;
