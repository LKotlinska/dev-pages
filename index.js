import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import auth, { attachUser } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT;

/* App Configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUser);

/* Routes Definitions */

app.get("/home", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/profile", auth, (req, res) => {
  res.render("profile", {
    title: "Profile",
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect("/home");
});

import registerRouter from "./routes/register.js";
app.use("/register", registerRouter);

import loginRouter from "./routes/login.js";
app.use("/login", loginRouter);

import logoutRouter from "./routes/logout.js";
app.use("/logout", logoutRouter);

import profileRouter from "./routes/profiles.js";
app.use("/profiles", profileRouter);

import collectionRouter from "./routes/collection.js";
app.use("/collection", collectionRouter);

app.get("/register", (req, res) => {
  res.render("register", { test: "hehe" });
});

app.get("/login", (req, res) => {
  res.render("login", {});
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to DB.");
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
});
