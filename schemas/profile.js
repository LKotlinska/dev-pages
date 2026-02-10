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
        "string.base": "Name must be text.",
        "string.empty": "Name cannot be empty.",
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot exceed 100 characters.",
        "string.pattern.base":
          "Name can only contain letters, spaces, hyphens and apostrophes.",
        "any.required": "Name is required.",
      }),

    about: Joi.string().trim().max(500).allow("", null).optional().messages({
      "string.base": "About section must be text.",
      "string.max": "About section cannot exceed 500 characters.",
    }),

    yearsExperience: Joi.number().integer().min(0).max(70).required().messages({
      "number.base": "Years of experience must be a number.",
      "number.integer": "Years of experience must be a whole number.",
      "number.min": "Years of experience cannot be negative.",
      "number.max": "Years of experience cannot exceed 70 years.",
      "any.required": "Years of experience is required.",
    }),

    // Skip array validation - just allow any array
    languages: Joi.array().optional(),
    frameworksAndLibraries: Joi.array().optional(),
    preferences: Joi.array().optional(),
    links: Joi.array().optional(),

    email: Joi.string().trim().lowercase().email().required().messages({
      "string.base": "Email must be text.",
      "string.empty": "Email cannot be empty.",
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

    phone: Joi.string()
      .trim()
      .pattern(/^[1-9]\d{8}$/) // First digit 1-9, then 8 more digits
      .length(9)
      .allow("", null)
      .optional()
      .messages({
        "string.pattern.base":
          "Phone number must be exactly 9 digits and cannot start with 0.",
        "string.length": "Phone number must be exactly 9 digits.",
      }),
  });

  return schema.validate(profile);
}

const Profile = model("Profile", profileSchema);

export { validateProfile };
export default Profile;
