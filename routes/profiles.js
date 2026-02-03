import express from 'express'
import ProfileModel from './../schemas/profile.js'
import { error } from 'console';

/** @type {import('mongoose').Model<any>} */
const Profile = ProfileModel


const router = express.Router();


router.post('/', async (req, res) => {
  
  try {

    
    const profile = await Profile.create({
        name: "Johnny Bravo",
        yearsExperience: 13,
        languages: ["JS", "Java", "Python", "PHP"],
        frameworksAndLibraries: ["Laravel", "Flutter"],
        email: "johnny.bravo@gmail.com",
        links: ["www.linkedin.com/in/johnnybravo"],
        about: "An avid developer, ah huh huh",
        phone: 46702723153
    });
    
    res.json({ data: profile });

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