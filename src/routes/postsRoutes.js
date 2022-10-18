import {
  addNewPost,
  getPosts,
  getPostWithID,
  getPostWithUserID,
  updatePost,
  deletePost,
} from "../controllers/postController";
import upload from "../utils/multer";

const postRoutes = (app) => {
  app
    .route("/posts")
    // get all posts
    .get((req, res, next) => {
      //middleware
      console.log(`Request from ${req.originalUrl}`);
      console.log(`Request type ${req.method}`);
      next();
    }, getPosts)
    // post endpoint - add a new post
    .post(upload.single("photo"), addNewPost);

  app
    .route("/posts/:postID")
    // get a specific post
    .get(getPostWithID)
    // updating a specific post
    .put(upload.single("photo"), updatePost)
    // delete a specific post
    .delete(deletePost);
};

export default postRoutes;
