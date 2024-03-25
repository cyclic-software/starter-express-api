import usersModel from "../models/users.model.js";
import jwt from "jsonwebtoken";

import secrete from "../config/public.key.js";
import apis from "../config/api_implementation.js";

const validateJwtToken = async (req, res, next) => {
    // const { token } = req.body || req.query;
    const token = req.headers.authorization.split(" ")[1];
    try {        
        if (!token) {
            res.status(401).json({ message: "Invalid token"});
        } else {
            const validateToken = await jwt.verify(token, secrete.PU_KEY);            
            req.user = validateToken;
            next();
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersModel.find();
        if(!users) {
            res.status(404).json({message: "No users available"});
        }
        const {password, updatedAt, ...other} = users;
        // const {updatedAt, ...other} = users._object;
        res.status(200).json({other});
    } catch (err) {        
        res.status(400).json({message: err.message});
    }
};

//Get followers by user id.
const getFollowers = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await usersModel.findById(userId);
        if (user) {
            const friends = await Promise.all(
                user.following.map(friendId =>{
                    return usersModel.findById(friendId);
                })
            );
            if (friends) {
                const userFriends = [];
                friends.map(friend=>{
                    const {_id, userName, profilePhoto} = friend;  
                    userFriends.push({_id, userName, profilePhoto});
                })
                res.status(200).json(userFriends);
            } else {
                res.status(404).json({message: 'You have no friends yet.', friends});
            }
        } else {
            res.status(404).json({message: 'User not found', user});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message});
    }
}

//Get a user by user id
const getUser = async (req, res) => {
    const id = req.user.userId;
    const userName = req.user.userEmail;
    console.log(id, userName, req)
    try {
        const user = id ? await usersModel.findById(id) : await usersModel.findOne({email: userName}); 
        if (!user) {
            res.status(404).json({message: 'User not found'});
        } else {
            const {password, updatedAt, ...other} = user._doc;
            res.status(200).json({other});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err});
    }
};

//Update user details
const updateUser = async (req, res, next) => {
    const {firstName, lastName, otherName} = req.body;
    const id = req.user.userId;
    let userExists, updateUser;
    if (!firstName || !lastName) {
        res.status(404).json({message: "You cannot omit first name and last name"});
    } else {
        try {
            userExists = await usersModel.findById({_id:id});           
            if (!userExists) {
                res.status(404).json({message: "User does not exist"});
            } else {
                updateUser = await usersModel.findByIdAndUpdate(id, req.body,{new: true});
                if (!updateUser) {
                    res.status(403).json({message: "Update failed"});
                } else {
                    res.status(200).json({message: "Update successful", updateUser});
                }
            }
        } catch (err) {
            res.status(400).json({message: err});
        }
    }
}

//delete user
const deleteUser = async (req, res) => {
    let userExists;
    try {
        userExists = await usersModel.findById(req.params.id);
    } catch (err) {
        res.status(404).json({ message: err});
    }
    if(!userExists) {
        res.status(404).json({ message: 'User not found' });
    }
    await usersModel.findByIdAndRemove(req.params.id);
    res.status(200).json(userExists);
};

//Follow user
const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await usersModel.findById(req.body.userId);
            const currentUser = await usersModel.findById(req.params.id);
            if(!user.followers.includes(req.params.id)) {
                await user.updateOne({$push: {followers: req.params.id}});
                await currentUser.updateOne({$push: {following: req.body.userId}});
                res.status(200).json({message:"You are now follwing ", success: true, userinfo: user.userName});
            }else {
                res.status(403).json({message: "You are already following this user."});
            } 
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    } else {
        res.status(403).json({message: "You can't follow yourself"});
    }
};

//Unfollow a user
const unfollowUser = async (req, res) => {
    console.log(req.body.userId, req.params.id)
    if (req.body.userId !== req.params.id) {
        try {
            const user = await usersModel.findById(req.body.userId);
            const currentUser = await usersModel.findById(req.params.id);
            if(user.followers.includes(req.params.id)) {
                await user.updateOne({$pull: {followers: req.params.id}});
                await currentUser.updateOne({$pull: {following: req.body.userId}});
                res.status(200).json({message:"You are no longer follwing ", success: true, userinfo: user.userName});
            }else {
                res.status(403).json({message: "You are not following this user."});
            }
        } catch(err) {
            res.status(500).json({message: err, error: err.message});
        }
    } else {
        res.status(403).json({message: "You can't unfollow yourself"});
    }
};


const filterSearch = async (req, res) => {
    const {searchTerm} = req.body.term; // Get the search term from user posts
    try {
        // Make API requests based on the search term
        const events = await apis.searchEvents(searchTerm);
        const conferences = await apis.searchConferences(searchTerm);
        const concerts = await apis.searchConcerts(searchTerm);
        const travelLocations = await apis.searchTravelLocations(searchTerm);

        // Combine and send the search results to the client
        res.status(200).json({
            events,
            conferences,
            concerts,
            travelLocations
        });
    } catch (error) {
        res.status(500).json("Internal Server Error " + error);
    }
};

export default {getAllUsers, getUser, updateUser, deleteUser, followUser, unfollowUser, getFollowers, validateJwtToken, filterSearch};