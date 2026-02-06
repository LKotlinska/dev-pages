import { MongoClient } from "mongodb";
import "dotenv/config";
import express from "express";

const router = express.Router();

const client = new MongoClient(process.env.DB_CONNECTION);
await client.connect();
const db = client.db("test");

const collectionRouter = router.get("/", async (req, res) => {
  const users = await db.collection("users").find({}).toArray();
  res.render("collection", {
    title: "Developer Collection",
    users: users,
  });
});

export default collectionRouter;
