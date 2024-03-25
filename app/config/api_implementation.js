import axios from 'axios';

// Function to search events using Eventbrite API
async function searchEvents(searchTerm) {
    const response = await axios.get(`https://www.eventbriteapi.com/v3/events/search/?q=${searchTerm}&token=YOUR_EVENTBRITE_API_KEY`);
    return response.data.events;
}

// Function to search conferences using Conferize API
async function searchConferences(searchTerm) {
    const response = await axios.get(`https://api.conferize.com/v1/conferences?search=${searchTerm}`);
    return response.data;
}

// Function to search concerts using Songkick API
async function searchConcerts(searchTerm) {
    const response = await axios.get(`https://api.songkick.com/api/3.0/events.json?apikey=YOUR_SONGKICK_API_KEY&query=${searchTerm}`);
    return response.data.resultsPage.results.event;
}

// Function to search travel locations using TripAdvisor API (Geoservices)
async function searchTravelLocations(searchTerm) {
    const response = await axios.get(`https://api.tripadvisor.com/api/partner/2.0/location_search/${searchTerm}?key=YOUR_TRIPADVISOR_API_KEY`);
    return response.data.data;
}

export default {searchTravelLocations, searchConcerts, searchEvents, searchConferences}