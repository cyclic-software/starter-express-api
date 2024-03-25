import express from 'express';
import tripController from '../controller/trip.controllers.js';


const routers = express.Router();

//GET Requests
// routers.route('/:id').get(tripController.validateJwtToken, tripController.getATrip); //Get a single trip

routers.route('/find_trips/').get(tripController.validateJwtToken, tripController.getUserTrips); //Get all friend trips

routers.route('/get_trips/').get(tripController.validateJwtToken, tripController.getAllUserTrips); //Get all user's trips

routers.route('/get_tagged_trips/').get(tripController.validateJwtToken, tripController.getTaggedTrips); //Get all tagged trips

routers.route('/get_public_trips/').get(tripController.getPublicTrips); //Get all public trips


routers.route('/view_trip_requests').get(tripController.validateJwtToken, tripController.getMyTripRequests); //Get a single trip


//POST Requests
routers.route('/create_new_trip').post(tripController.validateJwtToken, tripController.createNewTrip); //create a new trip

routers.route('/send_request/').post(tripController.validateJwtToken, tripController.sendTripRequest); //send
routers.route('/send_trip_invites/').post(tripController.validateJwtToken, tripController.sendTripInvites); //send trip invites

routers.route('/respond_to_invites/').post(tripController.validateJwtToken, tripController.actOnTripInvites); //Act on trip invites


//PUT Requests
routers.route('/approve_request/').put(tripController.validateJwtToken, tripController.approveRequests); //approve a request to join a trip

routers.route('/update_trip/:id').put(tripController.validateJwtToken, tripController.updateTrip); //Update a trip

routers.route('/like_trip/:id').put(tripController.likeTrip);


//DELETE requests
routers.route('/delete_trip/:id').delete(tripController.validateJwtToken, tripController.deleteTrip); //Delete trip
export default routers;