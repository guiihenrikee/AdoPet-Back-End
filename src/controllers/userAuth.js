import { UserSchema } from "../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const User = mongoose.model("User", UserSchema);

export const handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Preencha os campos antes de continuar!" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashPassword = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      email: email,
      password: hashPassword,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.hashPassword);
  if (match) {
    // create JWTs
    const token = jwt.sign({
      token: jwt.sign({ email: email, password: password }, "ADOPET", {
        expiresIn: "10s",
      }),
    });
    const refreshToken = jwt.sign({ email: foundUser.email }, "ADOPET", {
      expiresIn: "1d",
    });
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
};
