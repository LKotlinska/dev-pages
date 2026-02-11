import { MongoClient } from "mongodb";
import "dotenv/config";
import express from "express";
import frameworks from '../config/frameworks.js';
import languages from '../config/languages.js';

const router = express.Router();

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("test");

const collectionRouter = router.get("/", async (req, res) => {
  const users = await db.collection("users").find({}).toArray();
  res.render("collection", {
    title: "Developer Collection",
    users: users,
    languages: languages,
    frameworks: frameworks,    
  });
});

export default collectionRouter;
