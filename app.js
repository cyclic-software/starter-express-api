const express = require('express');
const bodyParser = require('body-parser');
const { validationResult, query } = require('express-validator');
const db = require('./module/movieModule');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

const database = require("./config/database");


// Initialize MongoDB connection and Movie model
db.initialize(database.url)
    .then(() => {
        console.log("MongoDB Connected");

        // Define API routes
        app.get('/api/movies', [
            query('page').optional().isInt().toInt(),
            query('perPage').optional().isInt().toInt(),
            query('title').optional().isString().trim(),
        ], async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const { page, perPage, title } = req.query;
                const pageNumber = page || 1;
                const itemsPerPage = perPage || 10;
                const movies = await db.getAllMovies(pageNumber, itemsPerPage, title);
                res.json({
                    page: pageNumber,
                    perPage: itemsPerPage,
                    total: movies.length, 
                    movies: movies,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api/movies/:id', async (req, res) => {
            try {
                const movieId = req.params.id;
                const movie = await db.getMovieById(movieId);
                if (!movie) {
                    return res.status(404).json({ error: 'Movie not found' });
                }
                res.json(movie);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.put('/api/movies/:id', async (req, res) => {
            try {
                const movieId = req.params.id;
                const data = { ...req.body };
                const updatedMovie = await db.updateMovieById(data, movieId);
                if (!updatedMovie) {
                    return res.status(404).json({ error: 'Movie not found' });
                }
                res.json(updatedMovie);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.post('/api/movies', async (req, res) => {
            try {
                const data = { ...req.body };
                console.log(data);
                await db.addNewMovie(data);
                return res.status(200).json({ message: 'Movie added successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.delete('/api/movies/:id', async (req, res) => {
            try {
                const movieId = req.params.id;
                await db.deleteMovieById(movieId);
                res.json({ message: 'Movie deleted successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Start the server
        app.listen(6000, () => {
            console.log("App listening on port : " + 6000);
        });
    })
    .catch((error) => {
        // Handle initialization error
        console.error("MongoDB connection error:", error);
    });