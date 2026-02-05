import express from 'express'
import ProfileModel from './../schemas/profile.js'
import { error } from 'console';

/** @type {import('mongoose').Model<any>} */
const Profile = ProfileModel


const router = express.Router();


router.post('/', async (req, res) => {
  
  try {

    
    const profile = await Profile.create({
        name: req.body.name,
        yearsExperience: req.body.yearsExperience,
        languages: req.body.languages,
        frameworksAndLibraries: req.body.frameworksAndLibraries,
        preferences: req.body.preferences,
        email: req.body.email,
        links: req.body.links,
        about: req.body.about,
        phone: req.body.phone
    });
    
    
    res.redirect("/profile");

  } catch (e) {

    res.status(400).json({ error: e.message });

  }
});


router.get('/', async (req, res) => {

  try {

    const profiles = await Profile.find();
  
    res.json({ data: profiles });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});


export default router