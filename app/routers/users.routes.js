import routes from 'express';
import usersController from '../controller/user.controllers.js';

const routers = routes.Router();

//GET Requests
routers.route('/all_users/').get(usersController.validateJwtToken, usersController.getAllUsers); //get all users
 
routers.route('/get_user/').get(usersController.validateJwtToken, usersController.getUser); //get a users

routers.route('/get_friends/:userId').get(usersController.validateJwtToken, usersController.getFollowers); //Get friends of user 

routers.route('/search/').get(usersController.validateJwtToken, usersController.filterSearch) //Search and filter user terms



//PUT Requests
routers.route('/update_user/').put(usersController.validateJwtToken, usersController.updateUser); //update user

routers.route('/follow_user/').put(usersController.validateJwtToken, usersController.followUser); //Follow a user

routers.route('/unfollow_user/').put(usersController.unfollowUser); //Unfollow a user

//DELETE Requests
routers.route('/delete_user/:id').delete(usersController.validateJwtToken, usersController.deleteUser); //delete user

export default routers