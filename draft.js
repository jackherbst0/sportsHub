document.addEventListener('DOMContentLoaded', () => {
    var clicks = 0;
    var score = 0;
    var current_pos;
    var scores = {
        qb: 0,
        rb: [0,0],
        wr: [0,0,0],
        te: 0,
        k: 0,
        dst: 0
    };
    let qb_data, rb_data, wr_data, te_data, k_data, dst_data;

    const team_photos = {
        "Arizona Cardinals": './team_photos/cardinals.png',
        "Atlanta Falcons": './team_photos/falcons.png',
        "Baltimore Ravens": './team_photos/ravens.jpg',
        "Buffalo Bills": './team_photos/bills.jpg',
        "Carolina Panthers": './team_photos/panthers.png',
        "Chicago Bears": './team_photos/bears.png',
        "Cincinnati Bengals": './team_photos/bengals.png',
        "Cleveland Browns": './team_photos/browns.jpg',
        "Dallas Cowboys": './team_photos/cowboys.jpg',
        "Denver Broncos": './team_photos/broncos.jpg',
        "Detroit Lions": './team_photos/lions.jpg',
        "Green Bay Packers": './team_photos/packers.jpeg',
        "Houston Texans": './team_photos/texans.jpeg',
        "Indianapolis Colts": './team_photos/colts.jpg',
        "Jacksonville Jaguars": './team_photos/jaguars.png',
        "Kansas City Chiefs": './team_photos/chiefs.jpg',
        "Las Vegas Raiders": './team_photos/raiders.png',
        "Los Angeles Chargers": './team_photos/chargers.jpg',
        "Los Angeles Rams": './team_photos/rams.png',
        "Miami Dolphins": './team_photos/dolphins.png',
        "Minnesota Vikings": './team_photos/vikings.jpg',
        "New England Patriots": './team_photos/patriots.png',
        "New Orleans Saints": './team_photos/saints.png',
        "New York Giants": './team_photos/giants.jpg',
        "New York Jets": './team_photos/jets.png',
        "Philadelphia Eagles": './team_photos/eagles.jpg',
        "Pittsburgh Steelers": './team_photos/steelers.jpeg',
        "San Francisco 49ers": './team_photos/niners.jpg',
        "Seattle Seahawks": './team_photos/seahawks.png',
        "Tampa Bay Buccaneers": './team_photos/buccaneers.jpg',
        "Tennessee Titans": './team_photos/titans.png',
        "Washington Commanders": './team_photos/commanders.png'
    }

    function handlePositionIconClick(position) {
        if(clicks < 10){
            selectRandomPlayer(position);
            current_pos = position;
            clicks += 1;
        }
    }

    document.getElementById('continue').addEventListener('click', () => {
        // Get the selected player's image and stats from the player-display div
        const playerImage = document.getElementById('selected-player');
        const playerStatsDiv = document.getElementById('player-stats');
        

        // Find the appropriate position div based on the player's position
        const positionDisplayDiv = document.getElementById(current_pos);

        let display_img = positionDisplayDiv.querySelector('img');
        display_img.src = playerImage.src;
        const playerStatsInPositionDiv = document.createElement('div');
        playerStatsInPositionDiv.innerHTML = playerStatsDiv.innerHTML; // Copy the content

        // Append the new playerStatsInPositionDiv to the positionDisplayDiv
        positionDisplayDiv.appendChild(playerStatsInPositionDiv);

        score = calculateTotalScore(scores);
        document.getElementById('score').innerHTML = score;

        // Clear the content from the player-display div
        playerImage.src = ''; // Clear the image
        playerImage.alt = '';
        playerStatsDiv.innerHTML = ''; // Clear the stats

        // Continue with selecting the next player or any other actions
        // You may call selectRandomPlayer() or perform other logic here
    });

    function calculateTotalScore(scores) {
        let totalScore = 0;
        for (const pos in scores) {
            totalScore += parseFloat(scores[pos]);
        }
        return totalScore;
    }

    // Add event listeners to position icons
    document.getElementById('qb').addEventListener('click', () => handlePositionIconClick('qb'));
    document.getElementById('rb1').addEventListener('click', () => handlePositionIconClick('rb1'));
    document.getElementById('rb2').addEventListener('click', () => handlePositionIconClick('rb2'));
    document.getElementById('wr1').addEventListener('click', () => handlePositionIconClick('wr1'));
    document.getElementById('wr2').addEventListener('click', () => handlePositionIconClick('wr2'));
    document.getElementById('wr3').addEventListener('click', () => handlePositionIconClick('wr3'));
    document.getElementById('te').addEventListener('click', () => handlePositionIconClick('te'));
    document.getElementById('k').addEventListener('click', () => handlePositionIconClick('k'));
    document.getElementById('dst').addEventListener('click', () => handlePositionIconClick('dst'));
    // Function to store player data
    async function fetchCSV(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const csvData = await response.text();
            const parsedData = Papa.parse(csvData, {
                header: true, // Treat the first row as headers
                dynamicTyping: true, // Automatically convert numbers to numbers
            });
            return parsedData.data; // Return the parsed data array
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error.message);
            throw error;
        }
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    qb_data = fetchCSV('FantasyPros_Fantasy_Football_Points_QB.csv');
    rb_data = fetchCSV('FantasyPros_Fantasy_Football_Points_RB.csv');
    wr_data = fetchCSV('FantasyPros_Fantasy_Football_Points_WR.csv');
    te_data = fetchCSV('FantasyPros_Fantasy_Football_Points_TE.csv');
    k_data = fetchCSV('FantasyPros_Fantasy_Football_Points_K.csv');
    dst_data = fetchCSV('FantasyPros_Fantasy_Football_Points_DST.csv');

    async function selectRandomPlayer(position) {
        try {
            let data;
            if (position === 'qb') {
                data = qb_data;
            } else if (position === 'rb1' || position === 'rb2') {
                data = rb_data;
            } else if (position === 'wr1' || position === 'wr2' || position === 'wr3') {
                data = wr_data;
            } else if (position === 'te') {
                data = te_data;
            } else if (position === 'k') {
                data = k_data;
            } else if (position === 'dst') {
                data = dst_data;
            }
            if (data) {
                getStats(data, position);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
    function getElement(pos){
        if(pos == 'qb'){
           return getRandomNumber(0,30); 
        }
        else if(pos == 'rb1' || pos == 'rb2'){
            return getRandomNumber(0,35);
        }
        else if(pos == 'wr1' || pos === 'wr2' || pos === 'wr3'){
            return getRandomNumber(0,40);
        }
        else if(pos == 'te'){
            return getRandomNumber(0,15);
        }
        else if(pos == 'k'){
            return getRandomNumber(0,20);
        }
        else{
            return getRandomNumber(0,30);
        }
    }

    async function getStats(data, pos) {
        let rand_week = getRandomNumber(1, 18);
        const element = getElement(pos);
        while(data[element][rand_week] == 'BYE' || data[element][rand_week] == '-'){
            rand_week = getRandomNumber(0,18);
        }
        console.log('data length:', data.length);
        console.log('element:', element);
    
        if (element >= 0 && element < data.length) {
            const playerData = data[element];
            console.log('playerData:', playerData);
            stats = {
                week: rand_week,
                points: playerData[rand_week], // Make sure to access the correct property of playerData
                name: playerData["Player"],
                pos: playerData["Pos"]
            };
            display_player(stats, pos);
        } else {
            console.error('Invalid element index:', element);
        }
    }

    async function getPhoto(name){
        const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLPlayerInfo?playerName=${name}`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'c8f0ee833fmsh72e4fb4da268b7ap1db8f6jsn6c6324d38e14',
            'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
            }
        };
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          console.log(data);
          return data.body[0].espnHeadshot;
        }catch(error){
            console.error("Error fetching photo");
        }
    }

    async function display_player(stats, pos) {
        const name = stats.name.replace(/ /g, "_");
        try {
            if(pos != 'dst'){
                const picPromise = getPhoto(name); // Fetch the image URL as a Promise
                const imageUrl = await picPromise; // Wait for the Promise to resolve
        
                // Check if imageUrl is defined
                if (imageUrl) {
                    // Set the image URL as the src attribute
                    const playerImage = document.getElementById('selected-player');
                    playerImage.src = imageUrl;
                    playerImage.alt = pos;
        
                    // Display player statistics
                    const playerStatsDiv = document.getElementById('player-stats');
                    playerStatsDiv.innerHTML = `${stats.name} in week ${stats.week} scored ${stats.points}`;

                    if (current_pos == 'rb1') {
                        scores.rb[0] = stats.points;
                    } else if (current_pos == 'rb2') {
                        scores.rb[1] = stats.points;
                    }
                    
                    // Update wr1, wr2, and wr3 scores
                    if (current_pos == 'wr1') {
                        scores.wr[0] = stats.points;
                    } else if (current_pos == 'wr2') {
                        scores.wr[1] = stats.points;

                    } else if (current_pos == 'wr3') {
                        scores.wr[2] = stats.points;
                    }
                    else{
                        scores[current_pos] = stats.points;
                    }

                } else {
                    // Handle the case where imageUrl is undefined (e.g., use a default image)
                    console.error("Player photo URL is undefined.");
                    // You can set a default image source here if needed
                    // playerImage.src = "default_image.jpg";
                }
            }
            else{
                const playerImage = document.getElementById('selected-player');
                playerImage.src = team_photos[stats.name];
                playerImage.alt = 'Defense';
                const playerStatsDiv = document.getElementById('player-stats');
                playerStatsDiv.innerHTML = `${stats.name} in week ${stats.week} scored ${stats.points}`;
                scores.dst = stats.points;
            }
        } catch (error) {
            console.error("Error fetching photo:", error.message);
            // Handle the error, e.g., set a default image source
            // playerImage.src = "default_image.jpg";
        }
    }

    async function fetchAndAssignData() {
        qb_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_QB.csv');
        rb_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_RB.csv');
        wr_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_WR.csv');
        te_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_TE.csv');
        k_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_K.csv');
        dst_data = await fetchCSV('FantasyPros_Fantasy_Football_Points_DST.csv');
    }
    
    fetchAndAssignData().then(() => {
        // Now you can call selectRandomPlayer or perform other actions
        selectRandomPlayer();
    }).catch((error) => {
        console.error('Error fetching and assigning data:', error.message);
    });

});