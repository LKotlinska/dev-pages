import { validateUser, User } from "../schemas/user.js";
import bcrypt from "bcrypt";
import express from "express";

const router = express.Router();

const registerRouter = router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).render("login", { error: error.details[0].message });
  }

  let user = await User.findOne({ username: req.body.username });

  if (user) {
    return res
      .status(400)
      .render("login", { error: "User already exists. Please sign in." });
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        password: password,
      });
      await user.save();
      return res
        .status(201)
        .render("login", { alert: "Successfully registered!" });
    } catch (error) {
      return res.status(400).render("login", { error: error.message });
    }
  }
});

export default registerRouter;
