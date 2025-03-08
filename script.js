const numImages = 26;
let currentMode = "view"; // Default mode
let mysteryOpen = false; // Track whether mystery container is expanded
let gameCode = ""

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
    document.getElementById("enlarged-view").classList.add("hidden");
});

// Event listener for mystery toggle
document.getElementById("mystery-toggle").addEventListener("click", toggleMystery);

// Splash Screen Logic
document.getElementById("create-game").addEventListener("click", () => {
    createGame();
    showGameContent();
});

// Show the join game form when "Join Game" is clicked
document.getElementById("join-game").addEventListener("click", () => {
    document.getElementById("game-controls").classList.add("hidden");
    document.getElementById("join-game-form").classList.remove("hidden");
});

document.getElementById("game-code-input").addEventListener("input", (e) => {
    const input = e.target;
    let value = input.value.replace(/-/g, ""); // Remove existing dashes
    if (value.length > 3) {
        value = value.slice(0, 3) + "-" + value.slice(3); // Insert dash after 3 characters
    }
    input.value = value.toUpperCase(); // Ensure uppercase
    // Hide error message when user starts typing
    const errorMessage = document.getElementById("code-error");
    errorMessage.classList.remove("visible");
});

document.getElementById("game-code-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission (if applicable)
        handleSubmit(); // Call the submit logic
    }
});

// Handle form submission
document.getElementById("submit-code").addEventListener("click", handleSubmit);

// Handle cancel button
document.getElementById("cancel-join").addEventListener("click", () => {
    document.getElementById("join-game-form").classList.add("hidden");
    document.getElementById("game-controls").classList.remove("hidden");
});

function showGameContent() {
    document.getElementById("splash-screen").classList.add("hidden");
    document.getElementById("game-content").classList.remove("hidden");
}

function generateCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
        if (i === 2) {
            code += "-"; // Add a dash after the first 3 characters
        }
    }
    return code;
}

function validateCode(inputCode) {
    const regex = /^[A-Z]{3}-[A-Z]{3}$/; // Matches XXX-XXX format with uppercase letters
    return regex.test(inputCode);
}



function handleSubmit() {
    const inputCode = document.getElementById("game-code-input").value.trim();
    const errorMessage = document.getElementById("code-error");

    if (validateCode(inputCode)) {
        // Code is valid, proceed with joining the game
        errorMessage.classList.remove("visible"); // Hide error message
        joinGame(inputCode);
    } else {
        // Code is invalid, show error message
        errorMessage.textContent = "Invalid code. Format: ABC-DEF.";
        errorMessage.classList.add("visible");
    }
}

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Fisher-Yates shuffle algorithm to randomize array order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
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
    enlargedView.classList.remove("hidden");
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

function showGameContent() {
    document.getElementById("splash-screen").classList.add("hidden");
    document.getElementById("game-content").classList.remove("hidden");
}

function selectRandomSubset(array, size, random) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, size);
}

// Game Logic (from earlier)
function createGame() {
    gameCode = generateCode();
    console.log("Game Code:", gameCode); // Display this code to the creator
    document.getElementById("game-code-display").textContent = `Game Code: ${gameCode}`;

    // Use the code as a seed for RNG
    const seed = Array.from(gameCode.replace("-", "")).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = seededRandom(seed);

    // Select 24 images from a larger pool
    const allImages = Array.from({ length: numImages }, (_, i) => `images/${i + 1}.jpg`); // Example: 50 images
    const selectedImages = selectRandomSubset(allImages, 24, random);

    // Set the mystery person for the creator
    const mysteryIndex = Math.floor(random * selectedImages.length);
    const mysteryPerson = selectedImages[mysteryIndex];
    shuffleArray(selectedImages);

    // Initialize the game with the selected images and mystery person
    initializeGame(selectedImages, mysteryPerson);
}

function joinGame(inputCode) {

    const formattedCode = inputCode.replace(/-/g, ""); // Remove dashes
    // Use the code as a seed for RNG
    const seed = Array.from(formattedCode).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = seededRandom(seed);

    // Select the same 24 images
    const allImages = Array.from({ length: numImages }, (_, i) => `images/${i + 1}.jpg`);
    const selectedImages = selectRandomSubset(allImages, 24, random);

    const creatorMysteryIndex = Math.floor(random * selectedImages.length);

    // Create a list of indices excluding the creator's mystery index
    const possibleIndices = selectedImages
        .map((_, index) => index) // Create an array of indices
        .filter(index => index !== creatorMysteryIndex); // Exclude the creator's mystery index

    // Randomly select an index for the joiner's mystery person
    const joinerMysteryIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
    const joinerMysteryPerson = selectedImages[joinerMysteryIndex];
    shuffleArray(selectedImages);

    // Initialize the game with the selected images and mystery person
    initializeGame(selectedImages, joinerMysteryPerson);
    const displayCode = formattedCode.slice(0, 3) + "-" + formattedCode.slice(3);
    document.getElementById("game-code-display").textContent = `Game Code: ${displayCode}`;
    document.getElementById("join-game-form").classList.add("hidden");
    showGameContent();
}

function initializeGame(selectedImages, mysteryPerson) {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    // Render the selected images
    selectedImages.forEach(src => {
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

    // Set the mystery person
    const mysteryNumber = mysteryPerson.match(/(\d+)\.jpg/)[1];
    document.getElementById("mystery-img").src = mysteryPerson;
    document.getElementById("mystery-text").textContent = `Your mystery person is #${mysteryNumber}`;

    // Expand mystery container by default
    if (!mysteryOpen) {
        toggleMystery();
    }
}