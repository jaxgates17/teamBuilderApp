const mongoose = require('mongoose');
const axios = require('axios');

mongoose.connect('mongodb+srv://jaxgat17:JJXv36Anp3EFkZ9j@jaxgat.t5phefy.mongodb.net/pokemonDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

const teamDB = mongoose.createConnection('mongodb+srv://jaxgat17:JJXv36Anp3EFkZ9j@jaxgat.t5phefy.mongodb.net/teamList?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

teamDB.on('connected', () => {
  console.log('Connected to Team database');
});

const pokemon = mongoose.model('pokemon2s', {
    name: String,
    sprite: String,
    types: [String]
});

const team = mongoose.model('teams', {
  sprite: [String],
  name: [String],
  types: [String],
  teamName: String
});

module.exports = {
    pokemon: pokemon,
    team: team
}


// SCRIPT TO ADD / UPDATE THE POKEMON DATABASE
/*
const pokemonSchema = new mongoose.Schema({
  name: String,
  sprite: String,
  types: [String]
})

const Pokemon = mongoose.model('Pokemon2s', pokemonSchema);
async function fetchAndInsertPokemon() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=493');
    const pokemonList = response.data.results;

    for (const pokemon of pokemonList) {
      const pokemonDataResponse = await axios.get(pokemon.url);
      const { name, sprites, types } = pokemonDataResponse.data;
    
      const typeNames = types.map(type => type.type.name);

      await Pokemon.create({ name, sprite: sprites.front_default, types: typeNames });
    }

    console.log('Pokemon data inserted successfully.');
  } catch (error) {
    console.error('Error inserting Pokemon data:', error);
  } finally {
    mongoose.disconnect();
  }
}

fetchAndInsertPokemon();
*/

/*
const pokemonSchema = new mongoose.Schema({
  name: String,
  sprite: String
});


const Pokemon = mongoose.model('Pokemon', pokemonSchema);
async function fetchAndInsertPokemon() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemonList = response.data.results;

    for (const pokemon of pokemonList) {
      const pokemonDataResponse = await axios.get(pokemon.url);
      const { name, sprites } = pokemonDataResponse.data;
      await Pokemon.create({ name, sprite: sprites.front_default });
    }

    console.log('Pokemon data inserted successfully.');
  } catch (error) {
    console.error('Error inserting Pokemon data:', error);
  } finally {
    mongoose.disconnect();
  }
}
*/