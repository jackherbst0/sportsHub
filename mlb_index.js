const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBScoresOnly';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
		'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
	}
};

function onGameClick(gameID) {
  // Redirect to game_details.html with the selected game ID as a URL parameter
  window.location.href = `boxscore.html?gameID=${encodeURIComponent(gameID)}`;
}

async function fetchMLBScores() { // Using Tank01 MLB Live In-Game Real Time Statistics rapidAPI
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
					<td>${awayTeam} vs ${homeTeam}</td>
					<td>Not Started Yet</td>
					<td>${homeTeam}</td>
					<td>${awayTeam}</td>
					<td> 0 - 0 </td>
				</tr>
			`;
      }
      else{
		const homeScore = game.lineScore.home.R;
      	const awayScore = game.lineScore.away.R;
        row += `
				<tr onclick="onGameClick('${gameKey}')">
					<td>${awayTeam} vs ${homeTeam}</td>
					<td>${status}</td>
					<td>${homeTeam}</td>
					<td>${awayTeam}</td>
					<td>${homeScore} - ${awayScore}</td>
				</tr>
			`;
      }
			scoreboardBody.innerHTML += row;
		}
	} catch (error) {
		console.error(error);
	}
}

// Initial call to fetch data
fetchMLBScores();

// Schedule updates every 30 seconds
const updateInterval = 864000; // 30 seconds in milliseconds
setInterval(fetchMLBScores, updateInterval);
