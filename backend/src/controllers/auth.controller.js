import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import user from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are requireed",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const User = await user.findOne({
      email,
    });

    if (User) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (err) {
    console.log("Error in sign up conmtroller", err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await user.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "invalid Credentials" });
    }
    const isPasswordCorrect = bcrypt.compare(password, userExists.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    generateToken(userExists?._id, res);
    res.status(200).json({
      _id: userExists._id,
      fullName: userExists.fullName,
      email: userExists.email,
      profilePic: userExists.profilePic,
    });
  } catch (err) {
    console.log("Error in login controller", err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err) {
    console.log("Error in logout controller", err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const updateProfile = async () => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic is required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser)
  } catch (err) {
    console.log("err in updateProfile", err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};


export const checkAuth =async(req,res)=>{
  try{
  res.status(200).json(req.user)
  }
  catch(err){
    console.log("err in check auth ", err);
    return res.status(500).json({
      message: "Internal Server error",
    });

  }
}