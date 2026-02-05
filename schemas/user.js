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

  profile: Profile.schema
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(100).required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
export { validateUser as validate, User };
