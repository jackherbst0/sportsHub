function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const gameID = getUrlParameter('gameID');
  
    // Display the game ID (you can add more detailed information here)
    var mid = gameID.indexOf('@');
    var road = gameID.substring(9,mid);
    var home = gameID.substring(mid+1,gameID.length);
    const team1_hit = {};
    const team2_hit = {};
    const team1_pitch = {};
    const team2_pitch = {};
    var c1 = 0;
    var c2 = 0;
    const team1_hit_ids = [];
    const team2_hit_ids = [];
    const team1_pitch_ids = [];
    const team2_pitch_ids = [];
    
    async function fetchBoxScore(){
      const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBoxScore?gameID=${gameID}`;
      const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b970d8ed23msh2ccbcd4e16452b3p165e74jsn24c7bd047f92',
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
            const playerInfo = {
              id: playerID,
              hitting: player.Hitting,
              baserunning: player.BaseRunning
            };
            if (player.team === home) {
              team1_hit[playerID] = playerInfo;
              team1_hit_ids.push(playerID);
            }
            else{
              team2_hit[playerID] = playerInfo;
              team2_hit_ids.push(playerID);
            }
        }
        else{
          const playerInfo = {
             id: playerID,
             pitching: player.Pitching
          };
          if (player.team === home) {
            team1_pitch[playerID] = playerInfo;
            team1_pitch_ids.push(playerID);
            c1++;
          }
          else{
            team2_pitch[playerID] = playerInfo;
            team2_pitch_ids.push(playerID);
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
        const playerData = {
          name: data.body.longName,
          photo: data.body.espnHeadshot
        };
        return playerData;
      } catch (error) {
        console.error(`Error fetching player name for ID ${playerID}:`, error);
      }
};

  function fill_table(team1_info, team2_info, team1_names, team2_names){
    console.log(team1_info);
    console.log(team2_info);
    console.log(team1_names);
    console.log(team2_names);
    let home_t = document.getElementById("home_hit");
    let away_t = document.getElementById("away_hit");
    let home_i = 0;
      for (const id in team1_info){
        home_t.innerHTML += `
          <tr>
          <td>${team1_names[home_i].name}<img class="player-photo" src="${team1_names[home_i].photo}" alt="photo"></td>
          <td>${team1_info[id].hitting.H || 0}</td>
          <td>${team1_info[id].hitting.AB || 0}</td>
          <td>${team1_info[id].hitting.RBI || 0}</td>
          <td>${team1_info[id].hitting.BB || 0}</td>
          <td>${team1_info[id].baserunning.SB || 0}</td>
          </tr>`;
          home_i++;
      }
    let away_i = 0;
      for (const id in team2_info){
        away_t.innerHTML += `
          <tr>
          <td>${team2_names[away_i].name}<img class="player-photo" src="${team2_names[away_i].photo}" alt="photo"></td>
          <td>${team2_info[id].hitting.H || 0}</td>
          <td>${team2_info[id].hitting.AB || 0}</td>
          <td>${team2_info[id].hitting.RBI || 0}</td>
          <td>${team2_info[id].hitting.BB || 0}</td>
          <td>${team2_info[id].baserunning.SB || 0}</td>
          </tr>`;
          away_i++;
      }
  }
      
    async function fill_batters(){
      console.log(team1_hit);
      console.log(team2_hit);
      const hitnames_1_promises = team1_hit_ids.map(h_hitterID=> fetchName(h_hitterID));
      const hitnames_2_promises = team2_hit_ids.map(a_hitterID=> fetchName(a_hitterID));
      try{
        const hitnames_1_results = await Promise.all(hitnames_1_promises);
        const hitnames_2_results = await Promise.all(hitnames_2_promises);
        console.log(hitnames_1_results);
        console.log(hitnames_2_results);
        fill_table(team1_hit, team2_hit, hitnames_1_results, hitnames_2_results);
      }
      catch(error){
        console.error(error);
      }
    }

    fetchBoxScore();

  });