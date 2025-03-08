// Generate image paths dynamically
const imageList = Array.from({ length: 24 }, (_, i) => `images/${i + 1}.jpg`);

// Fisher-Yates shuffle algorithm to randomize array order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Initialize and render the game board
function initializeGame(debugMode) {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    if (debugMode) {
        shuffleArray(imageList); // Shuffle before rendering
    }

    imageList.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        gameBoard.appendChild(img);
    });
}

initializeGame(true);
