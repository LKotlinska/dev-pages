import "dotenv/config";
import { validateUser, User } from "../schemas/user.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const secret = process.env.SECRET;
const jwsExpirySeconds = 30000000;

const loginRouter = router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(401).render("login", { error: error.details[0].message });
  } else {
    try {
      let user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res
          .status(400)
          .render("login", { error: "Incorrect email or password" });
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (!isCorrectPassword) {
        return res
          .status(400)
          .render("login", { error: "Incorrect email or password" });
      }

      const token = jwt.sign({ id: user._id }, secret);

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: jwsExpirySeconds,
      });
      res.redirect("/profile");
    } catch (error) {
      return res.status(400).render("login", { error: error.message });
    }
  }
});

export default loginRouter;
