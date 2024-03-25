import jwt from 'jsonwebtoken';
import tripModel from '../models/trips.model.js';
import User from '../models/users.model.js';
import Requests from '../models/request.model.js';
import secrete from '../config/public.key.js';
import mailer from '../config/mailer.js';

const validateJwtToken = async (req, res, next) => {
    // const { token } = req.body || req.query;
    if (!req.headers.authorization) {
        res.status(500).json({message: "Un Authorized request"});
    } else {
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
    }
};

//Get a single post
const getATrip = async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id).sort({createdAt: "descending"});
        if (!trip) {
            res.status(404).json({message: "May be this trip has been removed!"});
        }
        res.status(200).json(trip);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
};

//Get all post by a user
const getUserTrips = async(req, res, next)=> {
    try {        
        const currentUser = await User.findById(req.user.userId).sort({createdAt: "descending"});
        const userTrips = await tripModel.find({userId: currentUser._id.toString()});
        // console.log(userTrips, currentUser._id.toString());
        const friendTrips = await Promise.all(
            currentUser.following.map((friendId) => {
                return tripModel.find({userId: friendId})
            })
        );       
        const Trips  = userTrips.concat(...friendTrips);        
        if (!Trips) {
            res.status(404).json({message: "No trips found"});
        } else {
            res.status(200).json({message: 'Successfully retrieved', data: Trips});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const getAllUserTrips = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.userId}).sort({createdAt: "descending"});
        console.log(user);
        const trips = await tripModel.find({userId: user._id});
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getTaggedTrips = async (req, res) => {
    const userId = req.user.userId;
    try {
        const trips = await tripModel.find();
        let myTrips = [];
        let tripMap = trips.map(async(v, nx)=>{            
            if (v._doc.requests.includes(userId) && v._doc.isPublic === false) {
                const user = await User.findOne({_id: v._doc.userId}); 
                const {id, _v, createdAt, updatedAt, password, isAdmin, coverPhoto, ...others} = user._doc;           
                v._doc.createdBy = others;
                myTrips.push(v._doc);
            } else {
                const user = await User.findOne({_id: v._doc.userId}); 
                const {id, _v, createdAt, updatedAt, password, isAdmin, coverPhoto, ...others} = user._doc;           
                v._doc.createdBy = others;
                myTrips.push(v._doc);
            }
            return myTrips;
        }); 
        const updatedTrips = await Promise.all(tripMap);
        res.status(200).json(updatedTrips);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

const getPublicTrips = async (req, res) => {

    try {
        const trips = await tripModel.find();
        let tripMap = trips.map(async(v, nx)=>{            
            const user = await User.findOne({_id: v._doc.userId}); 
            const {id, _v, createdAt, updatedAt, password, isAdmin, coverPhoto, ...others} = user._doc;           
            v._doc.createdBy = others;
            return v._doc;
        });        
        const updatedTrips = await Promise.all(tripMap);
        const publicTrips = updatedTrips.filter(trip => trip.isPublic === true);
        res.status(200).json(publicTrips);
    } catch (err) {
        res.status(500).json({error: err.message});
    }

    // try {
    //     const trips = await tripModel.find();
    //     let tripMap = [];
    //     trips.forEach(async(v, nx)=>{            
    //         const user = await User.findOne({_id: v._doc.userId}); 
    //         const {_id, __v, createdAt, updatedAt, password, isAdmin, coverPhoto, ...others} = user._doc;           
    //         v._doc.createdBy = others;
    //         console.log(v._doc);
    //         return v._doc;
    //     });        
    //     const publicTrips = trips.filter(trip => trip.isPublic === true);
    //     res.status(200).json(publicTrips);
    // } catch (err) {
    //     res.status(500).json({error: err.message});
    // }
};

/**
 * Create new Trip
 * link: http://localhost:9900/api/trips/create_new_trip
 * @params: {
 *      userId : "string",
 *      tripName : "string",
 *      tripMembers: "array",
 *      requests: "array",
 *      tripType: "string",
 *      
 * }
 */
const createNewTrip = async (req, res) => {
    let userExists;    
    try {
        userExists = await User.findById(req.user.userId);
        if(!userExists) {
           res.status(403).json({message: "You must be logged in to create a trip"}); 
        } else {
            if (req.user.userId) {
                const data = req.body;
                data.userId = req.user.userId
                const newTrip = new tripModel(data)
                const saveTrip = await newTrip.save();
                res.status(200).json(saveTrip);
            } else {
                res.status(403).json({message: "You must create a trip only with your account"});
            }
        }
    } catch (err) {
        res.status(404).json({ error: err.message});
    }
}

const sendTripInvites = async (req, res) => {
    const { tripId, users } = req.body;
    const userId = req.user.userId;
    let failedTag = []
    try{
        const trip = await tripModel.findById(tripId);
        if (!trip) {
            res.status(404).json({ message: 'This trip may have expired or cancelled'});
        } else {
            for (let i=0; i < users.length; i++) {
                if (!trip.requests.includes(users[i])) {
                    const tags = await trip.updateOne({$push:{requests: users[i]}}); 
                    if (!tags) {
                        const user = await User.findOne({_id: users[i]});
                        const failed = {name: user.lastName + " " + user.firstName, msg: "Could not tag this person"};
                        failedTag.push(failed);
                    } else {
                        const user = await User.findOne({_id: users[i]});
                        const message = `<p>You have been invited to join this trip</p><br /><a href="http://localhost:9900/api/trip/get_trip/?tripId=${trip._id}">${trip.tripName}</a>`;
                        const params = {
                            'toEmail': user.email,
                            'subject': "TripMatch Registration Notification",
                            'message': message,
                            'toName': user.email
                        }
                        const sendMail = await mailer(params);
                    }
                } else {
                    const user = await User.findOne({_id: users[i]});
                    const name = user.lastName + " " + user.firstName;
                    const failed = {name:name, msg: "Could not tag this person"};
                    failedTag.push(failed);
                }
            }
            if (failedTag.length == users.length) {
                res.status(403).json({message: "Could not tag any of your selections"});
            } else if (failedTag.length > 0 && failedTag.length < users.length) {
                res.status(200).json({message: "Some persons were not tagged", failedTag});
            } else {
                res.status(200).json({message: "Selections tagged successfully", failedTag});
            }
        }
    } catch (err) {
        res.status(401).json({ message: err.message})
    }
}

const actOnTripInvites = async (req, res) => {
    const { tripId } = req.body;
    const userId = req.user.userId;
    try {
        const invite = await tripModel.findOne({_id: tripId});        
        if (!invite) {
            res.status(404).json({message: "No such Trip exists!"});
        } else {            
            if (!invite.tripMembers.includes(userId) && invite.requests.includes(userId)) {
                await invite.updateOne({$push:{tripMembers: userId}});
                await invite.updateOne({$pull:{requests: userId}});
                const creator = await User.findOne({_id: invite.userId});
                const user = await User.findOne({_id: userId});
                const fullName = user.lastName + " " + user.firstName;
                const message = `<p>${fullName} has accepted to join this trip<br /><a href="http://localhost:9900/api/trips/get_trips/?tripId=${invite._id}">${invite.tripName}</a>`;
                const params = {
                    'toEmail': creator.email,
                    'subject': "TripMatch Registration Notification",
                    'message': message,
                    'toName': creator.email
                }
                const sendMail = await mailer(params);
                console.log(sendMail);
                res.status(200).json({message: "You have accepted to join this trip "});
            } else {
                await invite.updateOne({$pull:{tripMembers: userId}});
                await invite.updateOne({$push:{requests: userId}});
                const creator = await User.findOne({_id: invite.userId});
                const user = await User.findOne({_id: userId});
                const fullName = user.lastName + " " + user.firstName;
                const message = `<p>${fullName} has declined your invitation to join this trip.<br />`;
                const params = {
                    'toEmail': creator.email,
                    'subject': "TripMatch Invitation Notification",
                    'message': message,
                    'toName': creator.email
                }
                const sendMail = await mailer(params);
                console.log(sendMail);
                res.status(200).json({message: "You have declined this trip invite "});
            }
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
}

/**
 * Get Trip requests
 * 
 */
const getMyTripRequests = async (req, res) => {    
    const user = await User.findOne({_id: req.user.userId});
    if (!user) {
        res.status(404).json({message: "You have to be logged in to access this records"});
    } else {
        const request = await Requests.find({tripId: req.body.tripId});
        if (request.length > 0) {            
            let requestMap = request.map(async(v, nx)=>{            
                const user = await User.findOne({_id: v._doc.requesterId}); 
                const {_id, __v, createdAt, updatedAt, password, isAdmin, coverPhoto, ...details} = user._doc;           
                v._doc.requester = details;
                return v._doc;
            });        
            const updatedTrips = await Promise.all(requestMap);
            res.status(200).json({message: "You have " + request.length + " on this trip", requests:updatedTrips})
        } else {
            res.status(404).json({message: "No requests yet"});
        }
    }
}

/**
 * Send request to join a trip
 * @param {tripId, id} req 
 * @param {a} res 
 */
const approveRequests = async (req, res) => {
    let userExists;
    const {tripId, requestId} = req.body;    
    try {
        userExists = await User.findOne({_id: req.user.userId});
        if(!userExists) {
           res.status(403).jsonOne({message: "You must be logged in to approve this request"}); 
        } else {
            const trip = await tripModel.findOne({_id:tripId});
            if (trip) {
                const request = await Requests.findOne({_id: requestId});
                if (!request) {
                    res.status(404).json({message: "It seems this request no longer exists"});
                } else {
                    const { requesterId, _id } = request._doc;                    
                    if (!trip.requests.includes(requesterId)) {
                        await trip.updateOne({$push:{requests: requesterId}});
                        await Requests.updateOne({_id:requestId}, {isApproved: true});
                        res.status(200).json({message: "Your have accepted this request ", request});
                    } else {
                        await trip.updateOne({$pull:{requests: requesterId}});
                        await Requests.updateOne({_id:requestId}, {isApproved: false});
                        res.status(200).json({message: "You have declined this request", request});
                    }
                }
            } else {
                res.status(404).json({message: "May be this trip has expired or removed"});
            }
        }
    } catch (err) {
        res.status(404).json({ error: err.message});
    }
}

// Send trip request
const sendTripRequest = async (req, res) => {
    let userExists;
    const {tripId, isGroup, others} = req.body;
    try {
        userExists = await User.findOne({_id: req.user.userId});
        
        if(!userExists) {
           res.status(403).json({message: "You must be logged in to send a request"}); 
        } else {
            const trips = await tripModel.findOne({_id: tripId});
            if (trips) {
                const { _id } = trips._doc;
                
                const requests = await Requests.findOne({tripId: _id.toString()});
                
                // If the trip does not exist any
                if (!requests) {
                    const data = {requesterId:req.user.userId, tripId: _id.toString(), isGroup: isGroup, others: others}
                    const newRequest = new Requests(data);                    
                    const saveRequest = await newRequest.save();
                    res.status(200).json({message: "Your request has been sent ", saveRequest});
                } else if (requests.isApproved) {
                    return res.status(409).json({ message: 'This request is already accepted' });
                } else {
                    await Requests.deleteOne({_id: requests._doc._id});
                    res.status(200).json({message: "You have withdrawn your request", requests});
                }
            } else {
                res.status(404).json({message: "May be this trip has expired or removed"});
            }
        }
    } catch (err) {
        res.status(404).json({ error: err.message});
    }
}

//Update a post
const updateTrip = async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id);
        if (!trip.userId == req.params.id) {
            res.status(403).json({message: "You cannot trip on a person's timeline without a user's consent."});
        }
        await trip.updateOne({$set: req.body});
        res.status(200).json({message: "The trip was successfully updated."});
    } catch(err) {
        res.status(403).json(err.message);
    }
}

//Delete a post
const deleteTrip = async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id);
        if (!trip.userId == req.params.id) {
            res.status(403).json({message: "You cannot delete another person's trip without a user's consent."});
        }
        await trip.deleteOne();
        res.status(200).json({message: "The trip was successfully deleted."});
    } catch(err) {
        res.status(403).json(err.message);
    }
}

//Like a post
const likeTrip = async (req, res) => {
    try {
        const trip = await tripModel.findById(req.params.id);
        if (trip) {
            if (!trip.likes.includes(req.body.userId)) {
                await trip.updateOne({$push:{likes: req.body.userId}});
                res.status(200).json({message: "Liked trip", trip});
            } else {
                await trip.updateOne({$pull:{likes: req.body.userId}});
                res.status(200).json({message: "Unliked trip", trip});
            }
        } else {
            res.status(404).json({message: "May be this trip has been removed"});
        }
    } catch(err) {
        res.status(500).json(err.message);
    }
}

export default {getPublicTrips, getUserTrips, getATrip, createNewTrip, updateTrip, deleteTrip, likeTrip, getAllUserTrips, approveRequests, sendTripRequest, validateJwtToken, getTaggedTrips, getMyTripRequests, sendTripInvites, actOnTripInvites}