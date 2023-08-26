function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

const props = {};

const gameID = getUrlParameter('gameID');
  
  document.addEventListener('DOMContentLoaded', () => {

    async function fetchProps(){
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBBettingOdds?gameDate=20230826&playerProps=true';
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
            for (const player in data.body[gameID].playerProps){
                const props = data.body[gameID].playerProps[player];
                const propinfo = {
                    id: getName(props.playerID),
                    hits: props.propBets.hits,
                    bases: props.propBets.bases,
                    rbi: props.propBets.rbis,
                    runs: props.propBets.runs,
                    hr: props.propBets.homeruns
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
                'X-RapidAPI-Key': 'b970d8ed23msh2ccbcd4e16452b3p165e74jsn24c7bd047f92',
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
        for (const player in props){
            props_table.innerHTML += `
              <tr>
              <td>${props[player].id}</td>
              <td>${props[player].hits}</td>
              <td>${props[player].bases}</td>
              <td>${props[player].hrs}</td>
              <td>${props[player].runs}</td>
              <td>${props[player].rbis}</td>
              </tr>`;
          }
    }
  });