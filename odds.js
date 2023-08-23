document.addEventListener('DOMContentLoaded', () => {
    const matchups = {};

    async function fetchAllOdds() {
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBettingOdds?gameDate=20230703&playerProps=true';
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
        let i = 0;
        for(const game in data.body){
            const info = data.body[game];
            matchupInfo = {
                home: info.homeTeam,
                away: info.awayTeam,
                line: info.caesars_sportsbook.totalUnder,
                o_odds: info.caesars_sportsbook.totalOverOdds,
                u_odds: info.caesars_sportsbook.totalUnderOdds,
                home_ML: info.caesars_sportsbook.homeTeamMLOdds,
                away_ML: info.caesars_sportsbook.awayTeamMLOdds,
                gameID: info.gameID
            };
            matchups[i] = matchupInfo;
            i += 1;
        }
    } catch (error) {
        console.error(error);
    }
}

    function createMatchupElement(matchup) {
        const matchupElement = document.createElement('div');
        matchupElement.classList.add('matchup');
        matchupElement.innerHTML = `
            <a href="${matchup.playerPropsLink}">
                <h2>${matchup.teams}</h2>
                <p>Over/Under: ${matchup.overUnder}</p>
                <p>Moneyline: ${matchup.moneyline}</p>
            </a>
        `;
        return matchupElement;
    }

    const matchupList = document.getElementById('matchup-list');
    matchups.forEach(matchup => {
        const matchupElement = createMatchupElement(matchup);
        matchupList.appendChild(matchupElement);
    });
});