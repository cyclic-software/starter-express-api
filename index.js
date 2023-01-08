const express = require('express');
const cors = require('cors');
const scraping = require('./app');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
	res.json({
		message: 'Scraping is SIIIIIIIIII!'
	});
});

app.get('/search/:title', (req, res) => {
	scraping.search(req.params.title)
		.then(search => {
			res.json(search);
		});
});

app.get('/recently/', (req, res) => {
	scraping.recently()
		.then(recently => {
			res.json(recently);
		});
});

app.get('/movies/', (req, res) => {
	scraping.movies()
		.then(movies => {
			res.json(movies);
		});
});

app.get('/series/', (req, res) => {
	scraping.series()
		.then(series => {
			res.json(series);
		});
});

app.get('/tvshows/', (req, res) => {
	scraping.tvshows()
		.then(tvshows => {
			res.json(tvshows);
		});
});

// app.get('/test/', (req, res) => {
// 	scraping.test()
// 		.then(test => {
// 			res.json(test);
// 		});
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listing on ${port}`);
	console.log(`Search: http://localhost:${port}/search/YOUR_INPUT`);
	console.log(`Recently: http://localhost:${port}/recently`);
	console.log(`Movies: http://localhost:${port}/movies`);
	console.log(`Series: http://localhost:${port}/series`);
	console.log(`Tv Shows: http://localhost:${port}/tvshows`);
});