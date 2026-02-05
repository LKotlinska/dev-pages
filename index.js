import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT;

/* App Configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/* Routes Definitions */

app.get("/home", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { title: "Profile" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import registerRouter from "./routes/register.js";
app.use("/register", registerRouter);

import loginRouter from "./routes/login.js";
app.use("/login", loginRouter);

import logoutRouter from "./routes/logout.js";
app.use("/logout", logoutRouter);

import profileRouter from "./routes/profiles.js";

app.use("/profiles", profileRouter);

app.get("/register", (req, res) => {
  res.render("register", { test: "hehe" });
});

app.get("/login", (req, res) => {
  res.render("login", {});
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

mongoose.connect(process.env.DB_CONNECTION).then(() => {
  console.log("Connected to DB.");
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
});
