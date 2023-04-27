const express = require('express');
const fs = require('fs');
const cors = require('cors')
const app = express();

app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/pokemon/:name', (req, res) => {
  fs.readFile(__dirname + '/pokedex.json', (err, data) => {
    if (err) throw err;
    const pokedex = JSON.parse(data);
    const pokemon = pokedex.pokemon.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).send('Pokemon not found');
    }
  });
});

app.listen(8000, () => {
  console.log('THE SERVER IS RUNNING ON PORT 8000!!! 🚝');
});
