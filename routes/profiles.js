import express from "express";
import ProfileModel, { validateProfile } from "../schemas/profile.js";
import { error } from "console";
import auth from "../middleware/auth.js";
import { User } from "../schemas/user.js";
import { prepareProfileData } from "../utility/formHelpers.js";
import { render } from "pug";
import frameworks from '../config/frameworks.js';
import languages from '../config/languages.js';
/** @type {import('mongoose').Model<any>} */
const Profile = ProfileModel;

console.log(languages);
const router = express.Router();


router.post("/", auth, async (req, res) => {
  try {
    // Check if user is logged in
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).render("login", {
        error: "Something went wrong, please log in again.",
      });
    }

    // Prep data to handle string as arrays
    const profileData = prepareProfileData(req.body);

    const { error } = validateProfile(profileData);

    if (error) {
      return res.status(400).render("profile", {
        error: error.details[0].message,
        userProfile: user.profile,
        languages: languages,
        frameworks: frameworks,    
      });
    }

    user.profile = profileData;
    user.markModified("profile");
    await user.save();

    res.render("profile", {
      alert: "Your profile has been sucessfully saved!",
      userProfile: user.profile,
      languages: languages,
      frameworks: frameworks,
    });
  } catch (e) {
    res.status(400).render("profile", { 
        error: e.message,
        languages: languages,
        frameworks: frameworks,
     });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    console.log(languages);
    res.render("profile", {
      userProfile: user?.profile || null,
      languages: languages,
      frameworks: frameworks,
    });
  } catch (error) {
    res.status(500).render("profile", { 
      error: error.message,
      languages: languages,
      frameworks: frameworks,
    });
  }
});

export default router;
