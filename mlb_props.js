function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

const props = {};

const gameID = getUrlParameter('gameID');
  
document.addEventListener('DOMContentLoaded', () => {

    async function fetchProps(){
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBettingOdds?gameDate=20230903&playerProps=true';
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
            for (const player in data.body[gameID].playerProps){
                const playerProps = data.body[gameID].playerProps[player];
                const playerName = await getName(playerProps.playerID);
                const propinfo = {
                    id: playerName,
                    hits: playerProps.propBets.hits,
                    bases: playerProps.propBets.bases,
                    rbi: playerProps.propBets.rbis,
                    runs: playerProps.propBets.runs,
                    hr: playerProps.propBets.homeruns
                };
                props[propinfo.id] = propinfo;
            }
            fill_props();
        } catch (error) {
            console.error(`Error fetching player props:`, error);
          }
    }

    async function getName(id){
        const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerInfo?playerID=${id}&getStats=false`;
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
            return data.body.longName;
        } catch (error) {
            console.error(`Error fetching names:`, error);
          }
    }

    function fill_props(){
        let props_table = document.getElementById('props');
        for (const player in props) {
            const currentPlayer = props[player];
    
            const hitsOne = currentPlayer.hits?.one || 'N/A';
            const basesTotal = currentPlayer.bases?.total || 'N/A';
            const basesOver = currentPlayer.bases?.over || 'N/A';
            const basesUnder = currentPlayer.bases?.under || 'N/A';
            const hrOne = currentPlayer.hr?.one || 'N/A';
            const runsTotal = currentPlayer.runs?.total || 'N/A';
            const runsOver = currentPlayer.runs?.over || 'N/A';
            const runsUnder = currentPlayer.runs?.under || 'N/A';
            const rbiOne = currentPlayer.rbi?.one || 'N/A';
    
            props_table.innerHTML += `
                <tr>
                <td>${currentPlayer.id || 'N/A'}</td>
                <td>Over 0.5: ${hitsOne}</td>
                <td>Total: ${basesTotal}
                Over: ${basesOver}
                Under: ${basesUnder}</td>
                <td>${hrOne}</td>
                <td>Total: ${runsTotal}
                Over: ${runsOver}
                Under: ${runsUnder}
                </td>
                <td>${rbiOne}</td>
                </tr>`;
        }
    }
    fetchProps();
});