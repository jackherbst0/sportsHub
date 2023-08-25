function onGClick(gameID) {
    // Redirect to game_details.html with the selected game ID as a URL parameter
    window.location.href = `sportshub_player_props.html?gameID=${encodeURIComponent(gameID)}`;
}


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
            let matchupInfo = {
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
        createMatchups(matchups);
    } catch (error) {
        console.error(error);
    }
}

    function createMatchups(matchups) {
        const tableBody = document.querySelector('#scoreboard tbody');
        tableBody.innerHTML = '';
        for (const matchup in matchups){
            let row = ``;
            row += `
            <tr onclick="onGClick('${matchups[matchup].gameID}')">
                <td>${matchups[matchup].away} at ${matchups[matchup].home}</td>
                <td>${matchups[matchup].home_ML}</td>
                <td>${matchups[matchup].away_ML}</td>
                <td>${matchups[matchup].u_odds}</td>
                <td>${matchups[matchup].line}</td>
                <td>${matchups[matchup].o_odds}</td>
        `;
            tableBody.innerHTML += row;
        }
    }
    fetchAllOdds();

});