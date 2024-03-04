

    Vue.createApp({

        data: function () {
            return {
                teamName: "",
                newSprite: "",
                newPokeName: "",
                newType: [],
                teams: [],
                showCreateButton: true,
                selectedTeamId: null
            };
    
        },
        methods: {
            addTeam: function () {
                let foundPokemon = false;
                let teamData = [];
                for (let i = 1; i <= 6; i++) {
                    const slot = document.getElementById(`slot-${i}`);
                    const pokemonSprite = slot.querySelector('.pokemon-sprite');
                    const pokemonNameElement = slot.querySelector('.pokemon-name');
                    const pokemonType = slot.querySelector('.pokemon-type');
                    
                    const newSprite = pokemonSprite.src;
                    const newPokeName = pokemonNameElement.textContent.trim();
                    const newType = pokemonType.textContent.trim();
                    
                    if (newSprite && newPokeName) {
                        foundPokemon = true;
                        console.log('newPokeName:', newPokeName);
                        console.log('newType: ', newType);
                        teamData.push({
                            sprite: newSprite,
                            name: newPokeName,
                            types: newType
                        });
                    }
                }
                if (foundPokemon) {
                    const formData = new URLSearchParams();
                    for (const pokemon of teamData) {
                        formData.append('sprite', pokemon.sprite);
                        formData.append('name', pokemon.name);
                        formData.append('types', pokemon.types);
                    }
                    formData.append('teamName', this.teamName);
                    
                    fetch("https://kind-yak-necklace.cyclic.app/teams", {
                        method: "POST",
                        body: formData.toString(),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(response => {
                        if (response.status == 201) {
                            alert("Team created!");
                            this.loadTeams();
                            //togglePopup();
                        }
                    });
                } else {
                    alert("Please select at least one Pokémon.");
                    return;
                }
                
            },
            deleteTeam: function (index) {
                if (confirm("Are you sure you want to delete this team?")) {
                    const teamId = this.teams[index]._id;
                    fetch(`https://kind-yak-necklace.cyclic.app/teams/${teamId}`, {
                        method: "DELETE"
                    })
                    .then(response => {
                        if (response.ok) {
                            this.loadTeams();
                            alert("Team deleted successfully!");
                
                        } else {
                            alert("Failed to delete team.");
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting team:', error);
                        alert('Failed to delete team. Please try again.');
                    });
                }
            },
            updateTeam: function() {
                const teamId = this.selectedTeamId;
                const updatedTeam = {
                    teamName: this.teamName,
                    pokemon: []
                };
                let foundPokemon = false;
                for (let i = 1; i <= 6; i++) {
                    const slot = document.getElementById(`slot-${i}`);
                    const pokemonSprite = slot.querySelector('.pokemon-sprite');
                    const pokemonNameElement = slot.querySelector('.pokemon-name');
                    const pokemonType = slot.querySelector('.pokemon-type');
                    
                    const newSprite = pokemonSprite.src;
                    const newPokeName = pokemonNameElement.textContent.trim();
                    const newType = pokemonType.textContent.trim();
                    
                    if (newSprite && newPokeName) {
                        foundPokemon = true;
                        updatedTeam.pokemon.push({
                            sprite: newSprite,
                            name: newPokeName,
                            types: newType
                        });
                    }
                }
            
                if (foundPokemon) {
                    const formData = new URLSearchParams();
                    for (const pokemon of updatedTeam.pokemon) {
                        formData.append('sprite', pokemon.sprite);
                        formData.append('name', pokemon.name);
                        formData.append('types', pokemon.types);
                    }
                    formData.append('teamName', this.teamName); 
                    
                    fetch(`https://kind-yak-necklace.cyclic.app/teams/${teamId}`, {
                        method: "PUT",
                        body: formData.toString(), 
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            this.loadTeams(); 
                            alert("Team updated successfully!");
                               
                        } else {
                            alert("Failed to update team.");
                        }
                    })
                    .catch(error => {
                        console.error('Error updating team:', error);
                        alert('Failed to update team. Please try again.');
                    });
                }
            },
    
            loadTeams: function () {
                fetch("https://kind-yak-necklace.cyclic.app/teams").then((response) => {
                    if (response.status == 200) {
                        response.json().then((teamsFromServer) => {
                            console.log("received team from API:", teamsFromServer)
                            this.teams = teamsFromServer;
                        })
                    }
    
                })
            },
            saveTeam: function () {
                if (!this.teamName.trim()) {
                    alert("Please enter a team name.");
                    return;
                }

                let foundPokemon = false;
                for (let i = 1; i <= 6; i++) {
                    const slot = document.getElementById(`slot-${i}`);
                    const pokemonNameElement = slot.querySelector('.pokemon-name');
                    if (pokemonNameElement.textContent.trim() !== "") {
                        foundPokemon = true;
                        break;
                    }
                }
                // If selects View Team, run updateTeam
                if (this.selectedTeamId !== null) {
                    this.updateTeam();
                } else {
                    this.addTeam();
                }
               // this.addTeam();
                for (let i = 1; i <= 6; i++) {
                    const slot = document.getElementById(`slot-${i}`);
                    const pokemonSprite = slot.querySelector('.pokemon-sprite');
                    const pokemonNameElement = slot.querySelector('.pokemon-name');
                    const pokemonType = slot.querySelector('.pokemon-type');
                    
                    
                    pokemonSprite.src = "";
                    pokemonSprite.alt = "";
                    pokemonType.textContent = "";
                    pokemonNameElement.textContent = "";
                }
                this.teamName = "";
                this.selectedTeamId = null;
                this.togglePopup();
            },

            populateSlot: function(slotNumber, sprite, name, types) {
                const slot = document.getElementById(`slot-${slotNumber}`);
                if (slot) {
                    const pokemonSprite = slot.querySelector('.pokemon-sprite');
                    const pokemonNameElement = slot.querySelector('.pokemon-name');

                    const pokemonType = slot.querySelector('.pokemon-type');
                    pokemonSprite.src = sprite;
                    pokemonNameElement.textContent = name;
                    pokemonType.textContent = types;
                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('delete-icon', 'fa', 'fa-trash');
                    deleteIcon.setAttribute('aria-hidden', 'true');
                    deleteIcon.addEventListener('click', () => {
                        this.deletePokemon(slotNumber);
                    });
                    slot.appendChild(deleteIcon);
                }
            },
            deletePokemon(index) {
                if (confirm("Are you sure you want to delete this Pokémon?")) {
                    //this.teams.splice(index, 1);
                    const slot = document.getElementById(`slot-${index + 1}`);
                    if (slot) {
                        const pokemonSprite = slot.querySelector('.pokemon-sprite');
                        const pokemonNameElement = slot.querySelector('.pokemon-name');
                        const pokemonType = slot.querySelector('.pokemon-type');
                        pokemonSprite.src = ""; 
                        pokemonSprite.alt ="";
                        pokemonNameElement.textContent = "";
                        pokemonType.textContent = "";
                    }
                }
                
            },
    

            togglePopup: function() {
                var popup = document.getElementById("popup-menu");
                popup.classList.toggle("show");
            
                if (!popup.classList.contains("show")) {
                    for (let i = 1; i <= 6; i++) {
                        const slot = document.getElementById(`slot-${i}`);
                        const pokemonSprite = slot.querySelector('.pokemon-sprite');
                        const pokemonNameElement = slot.querySelector('.pokemon-name');
                        const pokemonType = slot.querySelector('.pokemon-type');
                        
                        pokemonSprite.src = "";
                        pokemonSprite.alt = ""; 
                        pokemonNameElement.textContent = "";
                        pokemonType.textContent = "";
                        
                    }
                    this.teamName = "";
                    this.showCreateButton = true;
                } else {
                    this.showCreateButton = false;
                
                }
            },

            viewTeam(teamId) {
                const team = this.teams.find(team => team._id === teamId);
                this.selectedTeamId = teamId;
                if (team) {
                  
                  this.teamName = team.teamName;
                  for (let i = 0; i < team.sprite.length; i++) {
                    this.populateSlot(i + 1, team.sprite[i], team.name[i], team.types[i]);
                  }
                  
                  this.togglePopup();
                } else {
                  console.error('Team not found');
                }
              },
    
            searchPokemon: function() {
                const pokemonName = document.getElementById('search-field').value;
                if (!pokemonName.trim()) {
                    alert('Please enter a Pokemon name.');
                    return;
                }
    
                fetch(`https://kind-yak-necklace.cyclic.app/pokemon?name=${encodeURIComponent(pokemonName)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Pokemon not found');
                        }
                        return response.json();
                    })
                    .then(data => {
                        
                        for (let i = 1; i <= 6; i++) {
                            console.log('...')
                            const slot = document.getElementById(`slot-${i}`);
                            const pokemonNameElement = slot.querySelector('.pokemon-name');
                            const pokemonSprite = slot.querySelector('.pokemon-sprite');
                            const pokemonType = slot.querySelector('.pokemon-type');
                            
                            if (pokemonNameElement.textContent === ``) {
                                console.log("Condition met for Slot", i);
                                console.log("ok1");
                                pokemonSprite.src = data.sprite;
                                pokemonSprite.alt = data.name;
                                console.log
                                pokemonNameElement.textContent = data.name;
                                //pokemonType.textContent = data.types.join(', ');
                                document.getElementById('search-field').value = '';
                                return;
                            }
                        }
                        // If all 6 slots are used
                        alert('All slots are filled.');
                    })
                    .catch(error => {
                        console.error('Error fetching Pokemon data:', error);
                        alert('Pokemon not found. Please try again.');
                    });
            },


            
            
        },
    
    
    
        created: function () {
            console.log("Hello, Vue")
            this.loadTeams();
        }
    
    }).mount("#app");