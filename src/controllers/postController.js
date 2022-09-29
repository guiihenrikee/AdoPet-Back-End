import mongoose from "mongoose";
import { PostSchema } from "../models/postModel";

const Post = mongoose.model("Post", PostSchema);

export const addNewPost = (req, res) => {
  const newPost = new Post(req.body);

  // Separa os arquivos com virgulas
  if (req.files) {
    let path = "";
    req.files.forEach((files, index, arr) => {
      path = path + files.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    newPost.photos = path;
  }
  //-------------------------------------------------
  newPost.save((err, post) => {
    if (err) {
      res.send(err);
    }
    res.json(post);
  });
};

export const getPosts = (req, res) => {
  Post.find({}, (err, post) => {
    if (err) {
      res.send(err);
    }
    res.json(post);
  });
};

export const getPostWithID = (req, res) => {
  Post.findById(req.params.postID, (err, post) => {
    if (err) {
      res.send(err);
    }
    res.json(post);
  });
};

export const updatePost = (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.postID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, post) => {
      if (err) {
        res.send(err);
      }
      res.json(post);
    }
  );
};

export const deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.postID }, (err, post) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Post successfully deleted" });
  });
};
