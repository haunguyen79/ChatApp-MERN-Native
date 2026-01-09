import { Request, Response } from "express";
import User from "../modals/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../ultis/token";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, avatar } = req.body;
  try {
    // Validation
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ success: false, msg: "Please provide all required fields" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({
          success: false,
          msg: "Password must be at least 6 characters",
        });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, msg: "Invalid email format" });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, msg: "User already exists" });
      return;
    }

    // Create new user
    user = new User({
      email,
      password,
      name,
      avatar: avatar || "",
    });

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //Save user
    await user.save();

    //Gen token
    const token = generateToken(user);
    res.json({ success: true, token });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    //Find user by email

    const user = await User.
    findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, msg: "Invalid Credentials" });
      return;
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, msg: "Invalid Credentials" });
      return;
    }

    //Gen token
    const token = generateToken(user);
    res.json({ success: true, token });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
