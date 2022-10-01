import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

//Verify if the user already exists, if not add on the DB.
export const addNewUser = (req, res) => {
  let newUser = new User(req.body);
  User.findOne({ email: newUser.email }, (err, user) => {
    if (!user) {
      newUser.save((err, user) => {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    } else {
      res.send("Email já cadastrado no sistema!");
    }
  });
};

// Get all users
export const getUsers = (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
};

// Get a specific user by the ID
export const getUserWithID = (req, res) => {
  User.findById(req.params.userID, (err, user) => {
    if (err) {
      res.send("Usuário não encontrado!");
    }
    res.json(user);
  });
};

// Find a specific user by the ID and modify
export const updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    }
  );
};

// Delete an user by the ID
export const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userID }, (err, user) => {
    if (err) {
      res.send("Usuário não encontrado!");
    }
    res.json({ message: "Usuário deletado com sucesso!" });
  });
};

// Verification if the user is logged.
export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "User não autorizado!" });
  }
};

// New user registration using the hash encryption
export const register = (req, res) => {
  const userRegister = new User(req.body);
  userRegister.hashPassword = bcrypt.hashSync(req.body.password, 10);
  userRegister.save((err, user) => {
    if (err) {
      return res.json({ message: "Email já cadastrado no sistema!" });
    } else {
      user.hashPassword = undefined;
      return res.json({ message: "Cadastro efetuado com sucesso!" });
    }
  });
};

// User verification
export const login = (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ message: "Usuário não encontrado!" });
      } else if (user) {
        if (!user.comparePassword(req.body.password, user.hashPassword)) {
          res.status(401).json({ message: "Senha incorreta!" });
        } else {
          return res.json({
            token: jwt.sign(
              { name: user.name, email: user.email, _id: user.id },
              process.env.SECRET,
              { expiresIn: "5h" }
            ),
          });
        }
      }
    }
  );
};
