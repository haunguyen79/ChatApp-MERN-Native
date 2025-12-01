import { Schema, model, Document } from "mongoose";
import { UserProps } from "../types";

const userSchema = new Schema<UserProps>({
  email: {
    type: String,
    required: true,
    unique: true,      
    lowercase: true,  //Chuyen email ve chu thuong
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model<UserProps>("User", userSchema);
