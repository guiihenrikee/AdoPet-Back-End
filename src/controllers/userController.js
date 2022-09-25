import mongoose from "mongoose";
import { UserSchema } from "../models/userModel"

const User = mongoose.model("User", UserSchema);

export const addNewUser = (req, res) => {
  let newUser = new User(req.body);

  newUser.save((err, user) => {
    if(err){
      res.send(err)
    }
    res.json(user)
  })
}
export const getUsers = (req, res) => {
  User.find({}, (err, user) => {
    if(err){
      res.send(err)
    }
    res.json(user)
  })
}

export const getUserWithID = (req, res) => {
  User.findById(req.params.userID, (err, user) => {
    if(err){
      res.send(err)
    }
    res.json(user)
  })
}

export const updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userID }, req.body, { new: true, useFindAndModify: false},
    (err, user) => {
    if(err){
      res.send(err)
    }
    res.json(user)
  })
}

export const deleteUser = (req, res) => {
  User.remove({ _id: req.params.userID }, (err, user) => {
    if(err){
      res.send(err)
    }
    res.json({ message: "User successfully deleted"})
  })
}