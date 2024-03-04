const express = require('express');
const model = require('./pokemonList');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended: false}))
app.use(cors());

app.get('/pokemon', (request, response) => {

    const { name } = request.query;
    if (!name) {
        return response.status(400).json({ error: 'Missing Pokemon name in query parameter' });
    }
    model.pokemon.findOne({ name: name.toLowerCase() })
    .then(pokemon => {
        if (!pokemon) {
            return response.status(404).json({ error: 'Pokemon not found' });
        }
        response.set("Access-Control-Allow-Origin", "*");
        response.json(pokemon);
    })

});

app.get("/teams", function (request, response) {
    model.team.find().then((teams) => {
        console.log("teams from db:", teams);
        response.set("Access-Control-Allow-Origin", "*")
        response.json(teams)
    })
})

app.get('/teams/:id', (req, res) => {
    const teamId = req.params.id;

    model.team.findById(teamId)
        .then(team => {
            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }
            res.json(team);
        })
        .catch(error => {
            console.error('Error fetching team:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post("/teams", function(request, response) {
    console.log("request body:", request.body);
    const newTeam = new model.team({
        sprite: request.body.sprite,
        name: request.body.name,
        types: request.body.types,
        teamName: request.body.teamName
        
    })
    newTeam.save().then(() =>{
        response.set("Access-Control-Allow-Origin", "*")
        response.status(201).send("Created")

    })
})

app.put("/teams/:id", function(request, response) {
    console.log("request body:", request.body);
    const teamId = request.params.id;
    const updatedTeamData = {
        sprite: request.body.sprite,
        name: request.body.name,
        types: request.body.types,
        teamName: request.body.teamName
    };

    model.team.findByIdAndUpdate(teamId, updatedTeamData, { new: true })
        .then(updatedTeam => {
            response.set("Access-Control-Allow-Origin", "*");
            response.status(201).send("Updated");
        })

    });


app.delete("/teams/:id", function (request, response) {
    const teamId = request.params.id;

    model.team.findByIdAndDelete(teamId)
        .then(deletedTeam => {
            if (!deletedTeam) {
                return response.status(404).json({ error: 'Team not found' });
            }
            response.set("Access-Control-Allow-Origin", "*");
            response.status(200).json({ message: 'Team deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting team:', error);
            response.status(500).json({ error: 'Internal server error' });
        });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


