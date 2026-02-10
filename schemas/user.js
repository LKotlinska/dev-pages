import Joi from "joi";
import mongoose from "mongoose";
import Profile from "./profile.js";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },

  profile: Profile.schema,
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .lowercase()
      .pattern(/^[a-z0-9_-]+$/) // Only lowercase letters, numbers, underscore, hyphen
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": "Username must be text.",
        "string.empty": "Username cannot be empty.",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username cannot exceed 50 characters.",
        "string.pattern.base":
          "Username can only contain letters, numbers, underscores and hyphens.",
        "any.required": "Username is required.",
      }),
    password: Joi.string()
      .pattern(/^[a-z0-9_-]+$/)
      .min(8)
      .max(100)
      .required()
      .messages({
        "string.base": "Password must be text.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password cannot exceed 100 characters.",
        "string.pattern.base":
          "Password can only contain letters, numbers, underscores and hyphens.",
        "any.required": "Password is required.",
      }),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
export { validateUser, User };
