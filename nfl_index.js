const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLScoresOnly?gameDate=20230108';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
		'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
	}
};

const gameOdds = {};

function onGameClick(gameID) {
  // Redirect to game_details.html with the selected game ID as a URL parameter
  window.location.href = `boxscore.html?gameID=${encodeURIComponent(gameID)}`;
}


async function fetchOdds() {
	const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLBettingOdds?gameDate=20230108';
	const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
		'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
	}
};
	try{
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(data);
		for(const gameKey in data.body){
			const game = data.body[gameKey];
			const oddsInfo = {
				home: game.caesars_sportsbook.homeTeamMLOdds,
				away: game.caesars_sportsbook.awayTeamMLOdds
			  };
			gameOdds[gameKey] = oddsInfo;
		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchNFLScores() { // Using Tank01 MLB Live In-Game Real Time Statistics rapidAPI
	try {
		const response = await fetch(url, options);
		const data = await response.json();
    console.log(data);
		const scoreboardBody = document.querySelector('#scoreboard tbody');
		scoreboardBody.innerHTML = '';

		for (const gameKey in data.body) {
			const game = data.body[gameKey];
			const awayTeam = game.away;
      const homeTeam = game.home;
      const gameTime = game.gameTime;
      const status = game.gameStatus;
      let row =``;
      if(status == 'Not Started Yet'){
        row += `
        <tr onclick="onGameClick('${gameKey}')">
					<td>${awayTeam} at ${homeTeam}</td>
					<td>Not Started Yet</td>
					<td>${homeTeam} (${gameOdds[gameKey].home})</td>
					<td>${awayTeam} (${gameOdds[gameKey].away})</td>
					<td> 0</td>
					<td> 0</td>
				</tr>
			`;
      }
      else{
		const homeScore = game.lineScore.home.R;
      	const awayScore = game.lineScore.away.R;
        row += `
				<tr onclick="onGameClick('${gameKey}')">
					<td>${awayTeam} at ${homeTeam}</td>
					<td>${status}</td>
					<td>${homeTeam} (${gameOdds[gameKey].home})</td>
					<td>${awayTeam} (${gameOdds[gameKey].away})</td>
					<td> ${homeScore}</td>
					<td> ${awayScore}</td>
				</tr>
			`;
      }
			scoreboardBody.innerHTML += row;
		}
	} catch (error) {
		console.error(error);
	}
}

fetchOdds().then(() => {
	// After odds data is fetched, fetch MLB scores data
	fetchNFLScores();

// Schedule updates every 30 seconds
const updateInterval = 864000; // 30 seconds in milliseconds
setInterval(fetchNFLScores, updateInterval);
}).catch(error => {
	console.error("Error fetching odds data:", error);
});