// Generate image paths dynamically
const imageList = Array.from({ length: 24 }, (_, i) => `./images/${i + 1}.jpg`);
let currentMode = "view"; // Default mode
let mysteryOpen = false; // Track whether mystery container is expanded

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

    if (!debugMode) {
        shuffleArray(imageList);
    }

    // Pick mystery person randomly
    const randomIndex = Math.floor(Math.random() * imageList.length);
    const mysteryPerson = imageList[randomIndex];
    const mysteryNumber = mysteryPerson.match(/(\d+)\.jpg/)[1];

    // Create images with click event listeners
    imageList.forEach(src => {
        const card = document.createElement("div");
        card.classList.add("card");

        const front = document.createElement("div");
        front.classList.add("front");
        const img = document.createElement("img");
        img.src = src;
        front.appendChild(img);

        const back = document.createElement("div");
        back.classList.add("back");

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener("click", () => handleImageClick(card));
        gameBoard.appendChild(card);
    });

    // Set up mystery person display
    document.getElementById("mystery-img").src = mysteryPerson;
    document.getElementById("mystery-text").textContent = `Your mystery JD is #${mysteryNumber}`;

    // Expand mystery container by default
    if (!mysteryOpen) {
        toggleMystery();
    }
}

// Handle Image Click based on mode
function handleImageClick(card) {
    if (currentMode === "view") {
        const img = card.querySelector("img");
        enlargeImage(img.src);
    } else if (currentMode === "flip") {
        card.classList.toggle("flipped");
    } else if (currentMode === "highlight") {
        const front = card.querySelector(".front");
        front.classList.toggle("highlighted");
    }
}

// Mode Switching – update active button and current mode
document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.getAttribute("data-mode");
    });
});

// Close Enlarged View
document.getElementById("close-enlarged").addEventListener("click", () => {
    document.getElementById("enlarged-view").style.display = "none";
});

// Enlarge Image View
function enlargeImage(src) {
    const enlargedView = document.getElementById("enlarged-view");
    const enlargedImg = document.getElementById("enlarged-img");
    const enlargedText = document.getElementById("enlarged-text");

    // Set the enlarged image source
    enlargedImg.src = src;

    // Extract the image number from the src (e.g., "images/5.jpg" -> "5")
    const imageNumber = src.match(/(\d+)\.jpg/)[1];
    enlargedText.textContent = `JD # ${imageNumber}`;

    // Display the enlarged view
    enlargedView.style.display = "flex";
}

// Toggle mystery person container using a state variable
function toggleMystery() {
    const mysteryContainer = document.getElementById("mystery-container");
    const toggleArrow = document.getElementById("toggle-arrow");

    if (mysteryOpen) {
        mysteryContainer.style.transform = "translateY(100%)"; // Collapse
        toggleArrow.textContent = "⬆"; // Arrow points up
        mysteryOpen = false;
    } else {
        mysteryContainer.style.transform = "translateY(0%)"; // Expand
        toggleArrow.textContent = "⬇"; // Arrow points down
        mysteryOpen = true;
    }
}

// Event listener for mystery toggle
document.getElementById("mystery-toggle").addEventListener("click", toggleMystery);

initializeGame(false);
