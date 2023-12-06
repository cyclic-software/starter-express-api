const mongoose = require('mongoose');
const Movie = require('../models/movie');

// Initialize MongoDB connection and Movie model
const initialize = async (connectionString) => {
    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Create a new Movie in the collection
const addNewMovie = async (data) => {
    try {
        await Movie.create(data);
        console.log('New Movie added successfully');
    } catch (error) {
        console.error('Error adding new Movie:', error);
        throw error;
    }
};

// Return an array of all Movies for a specific page
const getAllMovies = async (page, perPage, title) => {
    try {
        const query = title ? { title: { $regex: new RegExp(title, 'i') } } : {};
        const movies = await Movie.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);
        return movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// Return a single Movie object whose "_id" value matches the "Id" parameter
const getMovieById = async (Id) => {
    try {
        const movie = await Movie.findById(Id);
        return movie;
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        throw error;
    }
};

// Overwrite an existing Movie whose "_id" value matches the "Id" parameter
const updateMovieById = async (data, Id) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(Id, data, { new: true });
        return updatedMovie;
    } catch (error) {
        console.error('Error updating movie by ID:', error);
        throw error;
    }
};

// Delete an existing Movie whose "_id" value matches the "Id" parameter
const deleteMovieById = async (Id) => {
    try {
        await Movie.deleteOne({ _id: Id });
        console.log('Movie deleted successfully');
    } catch (error) {
        console.error('Error deleting movie by ID:', error);
        throw error;
    }
};
module.exports = {
    initialize,
    addNewMovie,
    getAllMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById,
};