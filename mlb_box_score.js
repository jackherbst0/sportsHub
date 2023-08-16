function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const gameID = getUrlParameter('gameID');
  
    // Display the game ID (you can add more detailed information here)
    var road = gameID.substring(9,12);
    var home = gameID.substring(13,16);
    const team1_hit = {};
    const team2_hit = {};
    const team1_pitch = {};
    const team2_pitch = {};
    const hit_names1 = {};
    const hit_names2 = {};
    const pitch_names1 = {};
    const pitch_names2 = {};
    var names1 = [];
    var names2 = [];
    var c1 = 0;
    var c2 = 0;
    
    async function fetchBoxScore(){
      const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBoxScore?gameID=${gameID}`;
      const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
      }
      };
      try{
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const boxscoreBody = document.getElementById("boxscore");
        const playerStats = data.body.playerStats;
        for (const playerID in playerStats) {
          const player = playerStats[playerID];
          if (player.Hitting && player.Hitting.battingOrder && player.allPositionsPlayed !== "P") {
            if (player.team === home) {
              team1_hit[playerID] = player;
            }
            else{
              team2_hit[playerID] = player;
            }
        }
        else{
          if (player.team === home) {
            team1_pitch[playerID] = player;
            c1++;
          }
          else{
            team2_pitch[playerID] = player;
            c2++;
          }
        }
        }
        fill_batters()
      }
      catch (error) {
		console.error(error);
	  }
    }
    async function fetchName(playerID){
      const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerInfo?playerID=${playerID}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
          'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
          }
      };
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const playerName = data.body.longName;
        return data.body.longName;
      } catch (error) {
        console.error(`Error fetching player name for ID ${playerID}:`, error);
      }
};

  function fill_table(team1, team2){
    let home_t = document.getElementById("home_hit");
    let away_t = document.getElementById("away_hit");
    for(let i = 0; i < team1.length; i++){
      home_t.innerHTML += `<tr><td>${team1[i]}</td></tr>`;
    }
    for(let j = 0;j < team2.length; j++){
      away_t.innerHTML += `<tr><td>${team2[j]}</td></tr>`;
    }
  }
      
    async function fill_batters(){
      const hitnames_1_promises = Object.keys(team1_hit).map(h_hitterID=> fetchName(h_hitterID));
      const hitnames_2_promises = Object.keys(team2_hit).map(a_hitterID=> fetchName(a_hitterID));
      try{
        const hitnames_1_results = await Promise.all(hitnames_1_promises);
        const hitnames_2_results = await Promise.all(hitnames_2_promises);
        console.log(hitnames_1_results);
        console.log(hitnames_2_results);
        fill_table(hitnames_1_results, hitnames_2_results);
      }
      catch(error){
        console.error(error);
      }
    }


    fetchBoxScore();

  });