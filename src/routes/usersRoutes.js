import {
  addNewUser,
  getUsers,
  getUserWithID,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { login, register, loginRequired } from "../controllers/userController";

const usersRoutes = (app) => {
  app
    .route("/users")
    // get all users
    .get(
      (req, res, next) => {
        //middleware
        console.log(`Request from ${req.originalUrl}`);
        console.log(`Request type ${req.method}`);
        next();
      },
      loginRequired,
      getUsers
    )
    // post endpoint - add a new user
    .post(loginRequired, addNewUser);

  app
    .route("/users/:userID")
    // get a specific user
    .get(loginRequired, getUserWithID)
    // updating a specific user
    .put(loginRequired, updateUser)
    // delete a specific user
    .delete(loginRequired, deleteUser);

  // registration route
  app.route("/register").post(register);
  // login route
  app.route("/login").post(login);
};

export default usersRoutes;
