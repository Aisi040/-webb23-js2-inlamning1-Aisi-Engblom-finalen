let playerScore = 0;
let playerName = '';

async function fetchHighscores() {
    try {
        const response = await fetch('http://localhost:3000/highscores');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const highscoreList = document.getElementById('highscoreList');
        highscoreList.innerHTML = '';
        
        data.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.points}`;
            highscoreList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching highscores:', error);
    }
}

document.getElementById('startGameBtn').addEventListener('click', async () => {
    playerName = document.getElementById('playerName').value;
    if (playerName.trim() !== "") {
        document.getElementById('playerNameDisplay').textContent = playerName;
        document.getElementById('startGameBtn').style.display = 'none';
        document.getElementById('playerName').style.display = 'none';
        document.getElementById('playerDisplay').style.display = 'block';
        document.getElementById('gameElements').style.display = 'block';
        
        await fetchHighscores();
    } else {
        alert('Ange ditt namn innan du startar spelet.');
    }
});

document.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', async function() {
        const playerChoice = this.getAttribute('data-choice');
        const computerChoice = ['sten', 'sax', 'påse'][Math.floor(Math.random() * 3)];

        document.getElementById('playerChoice').innerText = playerChoice;
        document.getElementById('computerChoice').innerText = computerChoice;

        if (playerChoice === computerChoice) {
            document.getElementById('roundWinner').innerText = 'Oavgjort';
        } else if (
            (playerChoice === 'sten' && computerChoice === 'sax') ||
            (playerChoice === 'sax' && computerChoice === 'påse') ||
            (playerChoice === 'påse' && computerChoice === 'sten')
        ) {
            playerScore++;
            document.getElementById('playerScore').innerText = playerScore;
            document.getElementById('roundWinner').innerText = 'Spelaren vinner';
        } else {
            await saveHighscore(playerName, playerScore);
            playerScore = 0;
            document.getElementById('playerScore').innerText = playerScore;
            document.getElementById('roundWinner').innerText = 'Datorn vinner';
            
            await fetchHighscores();
        }
    });
});

async function saveHighscore(name, score) {
    try {
        const response = await fetch('http://localhost:3000/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                score: score
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving highscore:', error);
    }
}

// Initialize the game setup
function init() {
    document.getElementById('playerDisplay').style.display = 'none';
    document.getElementById('gameElements').style.display = 'none';
}

// Call the initialize function on page load
init();
