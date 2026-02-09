import Joi from "joi";
import { Schema, model } from "mongoose";

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    maxlength: 500,
  },
  yearsExperience: {
    type: Number,
    required: true,
  },
  languages: {
    type: Array,
    required: true,
  },
  frameworksAndLibraries: {
    type: Array,
  },
  preferences: {
    type: Array,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  links: {
    type: Array,
  },
});
function validateProfile(profile) {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z\s'-]+$/)
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.pattern.base":
          "Name can only contain letters, spaces, hyphens and apostrophes.",
      }),

    about: Joi.string().trim().max(500).allow("", null).optional(),

    yearsExperience: Joi.number().integer().min(0).max(70).required(),

    // Skip array validation - just allow any array
    languages: Joi.array().optional(),
    frameworksAndLibraries: Joi.array().optional(),
    preferences: Joi.array().optional(),
    links: Joi.array().optional(),

    email: Joi.string().trim().lowercase().email().required(),

    phone: Joi.string().trim().allow("", null).optional(),
  });

  return schema.validate(profile);
}

const Profile = model("Profile", profileSchema);

export { validateProfile };
export default Profile;
