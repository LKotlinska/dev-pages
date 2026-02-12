import jwt from "jsonwebtoken";
import { User } from "../schemas/user.js";
import frameworks from "../config/frameworks.js";
import languages from "../config/languages.js";

// middleware to attach user to cookie
export const attachUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        res.locals.user = {
          id: user._id.toString(),
          username: user.username,
        };
        req.user = decoded;
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    res.clearCookie("token");
    res.locals.user = null;
  }

  next();
};

export default function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    // Decoded is logged in user
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
}

//prevents logged in users from accessing login/register page
export const redirectIfAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        return res.render("profile", {
          title: "Profile",
          userProfile: user.profile,
          languages: languages,
          frameworks: frameworks,
          form: {},
        });
      }
    } catch (error) {
      res.clearCookie("token");
    }
  }
  next();
};
