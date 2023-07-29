const cartoonNames = [
  "Bubbles",
  "Sparkle",
  "Whiskers",
  "Sunny",
  "Peanut",
  "Cookie",
  "Gizmo",
  "Poppy",
  "Snickers",
  "Daisy",
  "Puddles",
  "Sprinkles",
  "Fuzzy",
  "Jellybean",
  "Marshmallow",
  "Noodle",
  "Cupcake",
  "Wiggles",
  "Fluffy",
  "Patches",
];

const getMongoLink = () => process.env.NODE_ENV ? "mongodb+srv://Password:Password@cluster0.m9g1x.mongodb.net/maps?retryWrites=true&w=majority" : 'mongodb://localhost:27017'; 
module.exports = { cartoonNames , getMongoLink};
