import upload from "../middleware/upload"
import { 
  addNewPost,
  getPosts,
  getPostWithID,
  updatePost,
  deletePost
} from "../controllers/postController"

const postRoutes = (app) => {

  app.route('/posts')
    // get all posts
    .get((req, res, next) => {
      //middleware
      console.log(`Request from ${req.originalUrl}`)
      console.log(`Request type ${req.method}`)
      next()
    }, getPosts)
    // post endpoint - add a new post
    .post(upload.array("photos", 5), addNewPost)

  app.route('/posts/:postID')
    // get a specific post
    .get(getPostWithID)
    // updating a specific post
    .put(upload.array("photos", 5), updatePost)
    // delete a specific post
    .delete(upload.single('photos'), deletePost)
}

export default postRoutes;