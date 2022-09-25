import { 
  addNewUser,
  getUsers,
  getUserWithID,
  updateUser,
  deleteUser
} from "../controllers/userController"

const usersRoutes = (app) => {
  
  app.route('/users')
    // get all users
    .get((req, res, next) => {
      //middleware
      console.log(`Request from ${req.originalUrl}`)
      console.log(`Request type ${req.method}`)
      next()
    }, getUsers)
    // post endpoint - add a new user
    .post(addNewUser)

  app.route('/users/:userID')
    // get a specific user
    .get(getUserWithID)
    // updating a specific user
    .put(updateUser)
    // delete a specific user
    .delete(deleteUser)
}

export default usersRoutes;