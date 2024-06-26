// Function to extract URL parameter by name from the current page's URL

///***************************************************************************/

function getUrlParameter(name) {
  // Create a URLSearchParams object from the window's location search
  const urlParams = new URLSearchParams(window.location.search);
  // Get the value associated with the given parameter name
  return urlParams.get(name);
}

//****************************************************************************/

// Initialize empty arrays and objects for storing team and player statistics

//****************************************************************************/

const offenseStats_h = {
  passing: [],
  rushing: [],
  receiving: [],
};
const offenseStats_a = {
  passing: [],
  rushing: [],
  receiving: [],
};
const team1_o_ids = [];
const team2_o_ids = [];
const defenseStats_h = [];
const defenseStats_a = [];

//*************************************************************************/


// Function to display statistics based on the selected type (offense or defense)

//****************************************************************************/

function showStats(statsType) {
  // Get HTML elements for displaying home and away team stats
  const homeStatsBody = document.getElementById('home_stats');
  const awayStatsBody = document.getElementById('away_stats');

  // Clear the existing content of both tables
  homeStatsBody.innerHTML = '';
  awayStatsBody.innerHTML = '';

  // Check if the selected stats type is "offense"
  if (statsType === 'offense') {
    // Show both home and away team offense statistics tables
    document.getElementById('home').style.display = 'table';
    document.getElementById('away').style.display = 'table';

    // Display offense statistics for passing, rushing, and receiving for both teams
    displayOffenseStats(offenseStats_h.passing, homeStatsBody);
    displayOffenseStats(offenseStats_h.rushing, homeStatsBody);
    displayOffenseStats(offenseStats_h.receiving, homeStatsBody);
    displayOffenseStats(offenseStats_a.passing, awayStatsBody);
    displayOffenseStats(offenseStats_a.rushing, awayStatsBody);
    displayOffenseStats(offenseStats_a.receiving, awayStatsBody);
  } else if (statsType === 'defense') {
    // Show only the away team defense statistics table
    document.getElementById('home').style.display = 'none';
    document.getElementById('away').style.display = 'table';

    // Display defense statistics for both teams
    displayDefenseStats(defenseStats_a, awayStatsBody);
    displayDefenseStats(defenseStats_h, homeStatsBody);
  }
}

// Function to display offense statistics in a table
function displayOffenseStats(stats_h, stats_a, tableBody) {
  // Iterate through offense statistics for both home and away teams
  stats_h.forEach(stat => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stat.player}</td>
      <td>${stat.yards || stat.receptions}</td>
      <td>${stat.touchdowns || stat.interceptions}</td>
    `;
    tableBody.appendChild(row);
  });
  stats_a.forEach(stat => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stat.player}</td>
      <td>${stat.yards || stat.receptions}</td>
      <td>${stat.touchdowns || stat.interceptions}</td>
    `;
    tableBody.appendChild(row);
  });
}

//****************************************************************************/

// Function to display defense statistics in a table

//****************************************************************************/

function displayDefenseStats(stats_h, stats_a, tableBody) {
  // Iterate through defense statistics for both home and away teams
  stats_h.forEach(stat => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stat.player}</td>
      <td>${stat.tackles}</td>
      <td>${stat.interceptions}</td>
    `;
    tableBody.appendChild(row);
  });
  stats_a.forEach(stat => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stat.player}</td>
      <td>${stat.tackles}</td>
      <td>${stat.interceptions}</td>
    `;
    tableBody.appendChild(row);
  });
}

//****************************************************************************/

// Wait for the DOM to be fully loaded before executing the following code
document.addEventListener('DOMContentLoaded', () => {
  // Get the 'gameID' URL parameter from the current page's URL
  const gameID = getUrlParameter('gameID');

  // Split the 'gameID' to determine the home and away teams
  var mid = gameID.indexOf('@');
  var home = gameID.substring(mid + 1, gameID.length);

  // Initialize objects and arrays to store team and player information
  const team1_o = {};
  const team2_o = {};
  const team1_d = {};
  const team2_d = {};

  // Function to fetch box score data from an API
  async function fetchBoxScore() {
    // Construct the API URL with the 'gameID'
    const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLBoxScore?gameID=${gameID}`;
    
    // Set headers for the API request
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b970d8ed23msh2ccbcd4e16452b3p165e74jsn24c7bd047f92',
        'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
      }
    };

    try {
      // Fetch data from the API
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);

      // Process player statistics and categorize them into offense and defense
      const playerStats = data.body.playerStats;
      for (const playerID in playerStats) {
        const player = playerStats[playerID];
        if (player.Defense) {
          // Store defensive player information
          const playerInfo = {
            id: playerID,
            tackles: player.Defense.totalTackles,
            tfl: player.Defense.tfl,
            sacks: player.Defense.sacks,
            int: player.Defense.defensiveInterceptions
          };
          if (player.team === home) {
            team1_d[playerID] = playerInfo;
            team1_d_ids.push(playerID);
          } else {
            team2_d[playerID] = playerInfo;
            team2_d_ids.push(playerID);
          }
        } else {
          // Store offensive player information
          const playerInfo = {
            id: playerID,
            rec: player.Receiving?.receptions || 'N/A',
            targets: player.Receiving?.targets || 'N/A',
            recTD: player.Receiving?.recTD || 'N/A',
            recYds: player.Receiving?.recYds || 'N/A',
            rushYds: player.Rushing?.rushYds || 'N/A',
            carries: player.Rushing?.carries || 'N/A',
            rushTD: player.Rushing?.rushTD || 'N/A',
            passYds: player.Passing?.passYds || 'N/A',
            int: player.Passing?.int || 'N/A',
            passTD: player.Passing?.passTD || 'N/A',
            fantasyPoints: player.fanstasyPoints
          };
          if (player.team === home) {
            team1_o[playerID] = playerInfo;
            team1_o_ids.push(playerID);
            c1++;
          } else {
            team2_o[playerID] = playerInfo;
            team2_o_ids.push(playerID);
            c2++;
          }
        }
      }

      // Categorize offense and defense statistics by player and position
      for (const playerID in team1_o) {
        const playerInfo = team1_o[playerID];
        if (playerInfo.passYds || playerInfo.int || playerInfo.passTD) {
          offenseStats_h.passing.push(playerInfo);
        }
        if (playerInfo.rushYds || playerInfo.carries || playerInfo.rushTD) {
          offenseStats_h.rushing.push(playerInfo);
        }
        if (playerInfo.recYds || playerInfo.rec || playerInfo.recTD) {
          offenseStats_h.receiving.push(playerInfo);
        }
      }
      for (const playerID in team2_o) {
        const playerInfo = team2_o[playerID];
        if (playerInfo.passYds || playerInfo.int || playerInfo.passTD) {
          offenseStats_a.passing.push(playerInfo);
        }
        if (playerInfo.rushYds || playerInfo.carries || playerInfo.rushTD) {
          offenseStats_a.rushing.push(playerInfo);
        }
        if (playerInfo.recYds || playerInfo.rec || playerInfo.recTD) {
          offenseStats_a.receiving.push(playerInfo);
        }
      }
      for (const playerID in team1_d) {
        const playerInfo = team1_d[playerID];
        defenseStats_h.push(playerInfo);
      }
      for (const playerID in team2_d) {
        const playerInfo = team2_d[playerID];
        defenseStats_a.push(playerInfo);
      }

      // Call the 'fill_batters' function to continue processing and displaying data
      fill_batters();
    } catch (error) {
      console.error(error);
    }
  }

//****************************************************************************/

  // Function to fetch player position and additional information

//****************************************************************************/

  async function fetchPosition(playerID) {
    // Construct the API URL with the 'playerID'
    const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLPlayerInfo?playerID=${playerID}`;
    
    // Set headers for the API request
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b970d8ed23msh2ccbcd4e16452b3p165e74jsn24c7bd047f92',
        'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
      }
    };

    try {
      // Fetch player information from the API
      const response = await fetch(url, options);
      const data = await response.json();
      
      // Extract player data including name, photo, and position
      const playerData = {
        name: data.body.espnName,
        photo: data.body.espnHeadshot,
        pos: data.body.pos
      };
      return playerData;
    } catch (error) {
      console.error(`Error fetching player name for ID ${playerID}:`, error);
    }
  }

//****************************************************************************/

  // Function to fill the table with batter (player) statistics

//****************************************************************************/

  function fill_table(team1_info, team2_info, team1_names, team2_names) {
    console.log(team1_info);
    console.log(team2_info);
    console.log(team1_names);
    console.log(team2_names);
    
    // Get HTML elements for displaying home and away team batter statistics
    let home_t = document.getElementById("home_hit");
    let away_t = document.getElementById("away_hit");
    let home_i = 0;
    
    // Iterate through the players on the home team and populate the table
    for (const id in team1_info) {
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
    
    // Iterate through the players on the away team and populate the table
    for (const id in team2_info) {
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

//****************************************************************************/

  // Function to fill batter statistics and initiate the data fetching process

//****************************************************************************/

  async function fill_batters() {
    console.log(team1_hit);
    console.log(team2_hit);

    // Fetch player names and additional information in parallel for both teams
    const p_names_1_promises = team1_o_ids.map(h_playerID => fetchPosition(h_playerID));
    const p_names_2_promises = team2_o_ids.map(a_playerID => fetchPosition(a_playerID));

    try {
      // Wait for all promises to resolve and store the results
      const p_names_1_results = await Promise.all(p_names_1_promises);
      const p_names_2_results = await Promise.all(p_names_2_promises);
      console.log(p_names_1_results);
      console.log(p_names_2_results);

      // Call the 'fill_table' function to display batter statistics
      fill_table(team1_o, team2_o, p_names_1_results, p_names_2_results);
    } catch (error) {
      console.error(error);
    }
  }

//****************************************************************************/

  // Initiate the data fetching process by calling the 'fetchBoxScore' function
  fetchBoxScore();
});