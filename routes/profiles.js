import express from 'express'
import ProfileModel from './../schemas/profile.js'
import { error } from 'console';
import auth from '../middleware/auth.js';
import { User } from '../schemas/user.js';

/** @type {import('mongoose').Model<any>} */
const Profile = ProfileModel


const router = express.Router();


router.post('/', auth, async (req, res) => {
    
    try {

        console.log('req.user:', req.user);
        const userId = req.user.id;
    
        const user = await User.findById(userId);
    
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        
        user.profile = {
            name: req.body.name,
            yearsExperience: req.body.yearsExperience,
            languages: req.body.languages,
            frameworksAndLibraries: req.body.frameworksAndLibraries,
            preferences: req.body.preferences,
            email: req.body.email,
            links: req.body.links,
            about: req.body.about,
            phone: req.body.phone
        };

        await user.save();
        
        
        res.redirect("profiles/me");

  } catch (e) {

    console.error('Profile creation error:', e);
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

router.get('/me', auth, async (req, res) => {

  try {

    const userId = req.user.id;
    
    const user = await User.findById(userId).select('profile');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user.profile });

  } catch (error) {
    console.error('Fetch user profile error:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router