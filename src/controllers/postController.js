import mongoose from "mongoose";
import { PostSchema } from "../models/postModel";
import cloudinary from "cloudinary";
const Post = mongoose.model("Post", PostSchema);

export const addNewPost = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!req.file)
      return res.json({ message: "Insira uma foto do pet para continuar!" });
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newPost = new Post({
      userID: req.body.userID,
      petName: req.body.petName,
      description: req.body.description,
      photo: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await newPost.save();
    res.json({ message: "Postagem criada com sucesso!" });
  } catch (error) {
    console.log(error);
  }
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

export const updatePost = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    let post = await Post.findById(req.params.postID);
    // Delete image from cloudinary
    await cloudinary.v2.uploader.destroy(post.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
    }
    const data = {
      userID: req.body.userID || post.userID,
      petName: req.body.petName || post.petName,
      description: req.body.description || post.description,
      photo: result.secure_url || post.photo,
      cloudinary_id: result.public_id || post.cloudinary_id,
    };
    post = await Post.findByIdAndUpdate(req.params.postID, data, { new: true });
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    // Find user by id
    let post = await Post.findById(req.params.postID);
    // Delete image from cloudinary
    await cloudinary.v2.uploader.destroy(post.cloudinary_id);
    // Delete user from db
    await post.remove();
    res.json({ message: "Postagem deletada com sucesso!" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
