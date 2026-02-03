import { Schema, model } from 'mongoose';


const profileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  about: {
    type: String, 
    maxLength: 500
  },
  yearsExperience: {
    type: Number,
    required: true
  },
  languages: {
    type: Array,
    required: true
  },
  frameworksAndLibraries: {
    type: Array
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  links: {
    type: Array
  }
});


const Profile = model('Profile', profileSchema);


export default Profile;
