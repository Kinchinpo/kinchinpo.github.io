let wordList = [];
let secretWord = "";
let currentGuess = "";
let attempts = 0;
const maxAttempts = 6;
let wordsGuess = [];
const needWins = 4;
const fixWord = ["vital", "fixer", "pinky", "whale"];

function updateProgress() {
    const winCount = parseInt(localStorage.getItem("winCount") || "0", 10);
    document.getElementById("progress-tracker").textContent = `Wins: ${winCount}/${needWins}`;
}


async function loadWords() {
    try {
        const response = await fetch("words2.json");
        wordList = await response.json();
        let playedWords = new Set(JSON.parse(localStorage.getItem("playedWords") || "[]"));

        // Filter out already played words
        let availableWords = wordList.filter(word => !playedWords.has(word));
        console.log(availableWords);
        if (availableWords.length === 0) {
            console.log(wordList);
            
            playedWords = new Set(localStorage.setItem("playedWords", JSON.stringify([])));
            availableWords = wordList.filter(word => !playedWords.has(word));
            console.log(availableWords);
            
        }
        
        // if (availableWords.length === 0) {
        //     console.error("No more unique words left to play!");
        //     return;
        // }

        // secretWord = wordList[Math.floor(Math.random() * wordList.length)];
        secretWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        playedWords.add(secretWord);
        localStorage.setItem("playedWords", JSON.stringify([...playedWords])); // Save back to localStorage
        console.log("Secret word:", secretWord);
        setupGameBoard();
        document.addEventListener("keydown", handleKeyboardInput); // Listen for keyboard input

        await fetch('guess.txt')
        .then(response => response.text())
        .then(text => {
            wordsGuess = text.split('\n')
            .map(word => word.trim())
            .filter(word => word);
        })
    } catch (error) {
        console.error("Error loading words:", error);
    }
}

function setupGameBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    for (let i = 0; i < maxAttempts * 5; i++) {
        const div = document.createElement("div");
        div.classList.add("letter-box");
        gameBoard.appendChild(div);
    }

    updateProgress(); // Show progress when the game starts
    setupKeyboard();
}

function setupKeyboard() {
    const keyboardDiv = document.getElementById("keyboard");
    keyboardDiv.innerHTML = "";

    const rows = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    rows.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("keyboard-row");

        row.split("").forEach(letter => {
            const btn = document.createElement("button");
            btn.classList.add("key");
            btn.textContent = letter;
            btn.onclick = () => handleKeyPress(letter);
            rowDiv.appendChild(btn);
        });

        keyboardDiv.appendChild(rowDiv);
    });

    // Create the row for Enter and Backspace keys
    const bottomRowDiv = document.createElement("div");
    bottomRowDiv.classList.add("keyboard-row");

    const enterKey = document.createElement("button");
    enterKey.textContent = "Enter";
    enterKey.classList.add("key", "wide-key");
    enterKey.onclick = submitGuess;
    bottomRowDiv.appendChild(enterKey);

    const backspaceKey = document.createElement("button");
    backspaceKey.textContent = "←";
    backspaceKey.classList.add("key", "wide-key");
    backspaceKey.onclick = deleteLetter;
    bottomRowDiv.appendChild(backspaceKey);

    keyboardDiv.appendChild(bottomRowDiv);

    // Arrow key setup
    const arrowRowDiv = document.createElement("div");
    arrowRowDiv.classList.add("keyboard-arrow-row");

    const arrowKey = document.createElement("button");
    arrowKey.textContent = "↓";
    arrowKey.classList.add("key", "arrow-key");

    // Define the action for the arrow key
    const moveToNextSection = () => {
        document.getElementById("game-container").style.transform = "translateY(-100vh)";
        document.getElementById("game-container").style.opacity = "0";

        // Move the new section up and fade in
        document.getElementById("new-section").style.transform = "translateY(-100vh)";
        document.getElementById("new-section").style.opacity = "1";

        displayPlayedWords();

        // Disable scrolling
        setTimeout(() => {
            document.body.style.overflow = "hidden";
        }, 1000);
    };

    // Assign arrow key click logic
    arrowKey.onclick = moveToNextSection;

    arrowRowDiv.appendChild(arrowKey);
    keyboardDiv.appendChild(arrowRowDiv);

    // Initially hide the arrow key
    arrowRowDiv.style.display = "none";

    // Check if the user has won 4 times and show the arrow key if true
    const winCount = parseInt(localStorage.getItem("winCount") || "0", 10);
    if (winCount >= needWins) {
        arrowRowDiv.style.display = "block";
        localStorage.setItem("winCount", 0);
        localStorage.setItem("playedWords1", JSON.stringify(fixWord));

        // Change all key buttons to pink and remove text
        document.querySelectorAll(".key").forEach(btn => {
            btn.style.backgroundColor = "#F8C8DC";
            btn.style.color = "#F8C8DC"; // Remove text
            btn.onclick = moveToNextSection; 
        });

        // Change the game board to pink and clear text
        document.querySelectorAll(".letter-box").forEach(box => {
            box.style.backgroundColor = "#F8C8DC";
            box.style.color = "#F8C8DC";  // Remove text
            box.onclick = moveToNextSection; 
        });

        // Remove the legend
        const legend = document.querySelector("legend");
        if (legend) {
            legend.style.display = "none"; // Hide the legend
        }

        // Trigger the same behavior for any key press (same as arrow key action)
        document.querySelectorAll(".key").forEach(btn => {
            btn.onclick = moveToNextSection;
        });
    }
}


// function setupKeyboard() {
//     const keyboardDiv = document.getElementById("keyboard");
//     keyboardDiv.innerHTML = "";

//     const rows = [
//         "QWERTYUIOP",
//         "ASDFGHJKL",
//         "ZXCVBNM"
//     ];

//     rows.forEach((row) => {
//         const rowDiv = document.createElement("div");
//         rowDiv.classList.add("keyboard-row");

//         row.split("").forEach(letter => {
//             const btn = document.createElement("button");
//             btn.classList.add("key");
//             btn.textContent = letter;
//             btn.onclick = () => handleKeyPress(letter);
//             rowDiv.appendChild(btn);
//         });

//         keyboardDiv.appendChild(rowDiv);
//     });

//     // Create the row for Enter and Backspace keys
//     const bottomRowDiv = document.createElement("div");
//     bottomRowDiv.classList.add("keyboard-row");

//     const enterKey = document.createElement("button");
//     enterKey.textContent = "Enter";
//     enterKey.classList.add("key", "wide-key");
//     enterKey.onclick = submitGuess;
//     bottomRowDiv.appendChild(enterKey);

//     const backspaceKey = document.createElement("button");
//     backspaceKey.textContent = "←";
//     backspaceKey.classList.add("key", "wide-key");
//     backspaceKey.onclick = deleteLetter;
//     bottomRowDiv.appendChild(backspaceKey);

//     keyboardDiv.appendChild(bottomRowDiv);

//     // Arrow key setup
//     const arrowRowDiv = document.createElement("div");
//     arrowRowDiv.classList.add("keyboard-arrow-row");

//     const arrowKey = document.createElement("button");
//     arrowKey.textContent = "↓";
//     arrowKey.classList.add("key", "arrow-key");
//     // arrowKey.onclick = () => console.log("Arrow key pressed!");
//     // arrowKey.onclick = () => {
//     //     // Scroll to the bottom
//     //     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    
//     //     // Disable scrolling after scrolling down
//     //     setTimeout(() => {
//     //         document.body.style.overflow = "hidden";
//     //     }, 500); // Wait for smooth scrolling to finish
//     // };
//     arrowKey.onclick = () => {
//         document.getElementById("game-container").style.transform = "translateY(-100vh)";
//         document.getElementById("game-container").style.opacity = "0";

//         // Move the new section up and fade in
//         document.getElementById("new-section").style.transform = "translateY(-100vh)";
//         document.getElementById("new-section").style.opacity = "1";

//         displayPlayedWords();

//         // Disable scrolling
//         setTimeout(() => {
//             document.body.style.overflow = "hidden";
//         }, 1000);
//     };

//     arrowRowDiv.appendChild(arrowKey);
//     keyboardDiv.appendChild(arrowRowDiv);

//     // Initially hide the arrow key
//     arrowRowDiv.style.display = "none";

//     // Check if the user has won 4 times and show the arrow key if true
//     const winCount = parseInt(localStorage.getItem("winCount") || "0", 10);
//     if (winCount >= needWins) {
//         arrowRowDiv.style.display = "block";
//         localStorage.setItem("winCount", 0);
//         // localStorage.removeItem("playedWords");
//         localStorage.setItem("playedWords1", JSON.stringify(fixWord));

//         // Change all key buttons to pink and remove text
//         document.querySelectorAll(".key").forEach(btn => {
//             btn.style.backgroundColor = "#F8C8DC";
//             btn.style.color = "#F8C8DC"; // Remove text
//         });

//         // Change the game board to pink and clear text
//         document.querySelectorAll(".letter-box").forEach(box => {
//             box.style.backgroundColor = "#F8C8DC";
//             box.style.color = "#F8C8DC";  // Remove text
//         });

//         const legend = document.querySelector("legend");
//         if (legend) {
//             legend.style.display = "none"; // Hide the legend
//         }
//     }
// }



function handleKeyPress(letter) {
    if (currentGuess.length < 5) {
        currentGuess += letter;
        updateBoard();
    }
}

function handleKeyboardInput(event) {
    const key = event.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
    } else if (event.key === "Backspace") {
        deleteLetter();
    } else if (event.key === "Enter") {
        submitGuess();
    }
}

function deleteLetter() {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
}

function updateBoard() {
    const rowStart = attempts * 5;
    const letterBoxes = document.querySelectorAll(".letter-box");
    
    for (let i = 0; i < 5; i++) {
        letterBoxes[rowStart + i].textContent = currentGuess[i] || "";
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) {
        alert("Word must be 5 letters long!");
        return;
    }

    if (!wordsGuess.includes(currentGuess.toLowerCase())) {
        alert("Word not in list!");
        return;
    }

    checkGuess();
    currentGuess = "";
    attempts++;

    if (attempts === maxAttempts && currentGuess !== secretWord) {
        alert(`Game Over! The word was: ${secretWord}`);
        let winCount = parseInt(localStorage.getItem("winCount") || "0", 10);
        winCount++;
        localStorage.setItem("winCount", winCount);
        setTimeout(() => location.reload(), 2000);
    }
}

function checkGuess() {
    const rowStart = attempts * 5;
    const letterBoxes = document.querySelectorAll(".letter-box");
    const guessArray = currentGuess.toLowerCase().split("");
    const keyButtons = document.querySelectorAll(".key");
    let guess = "";

    guessArray.forEach((letter, i) => {
        const letterBox = letterBoxes[rowStart + i];
        const keyButton = [...keyButtons].find(btn => btn.textContent.toUpperCase() === letter.toUpperCase());

        setTimeout(() => {
            letterBox.classList.add("flip");
            
            setTimeout(() => {
                letterBox.classList.remove("flip");

                if (letter === secretWord[i]) {
                    letterBox.classList.add("correct");
                    if (keyButton) keyButton.classList.add("correct");
                } else if (secretWord.includes(letter)) {
                    letterBox.classList.add("present");
                    if (keyButton && !keyButton.classList.contains("correct")) keyButton.classList.add("present");
                } else {
                    letterBox.classList.add("absent");
                    if (keyButton && !keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
                        keyButton.classList.add("absent");
                    }
                }
            }, 250);
        }, i * 500);
    });

    guess = currentGuess;
    
    setTimeout(() => {
        if (guess.toLowerCase() === secretWord) {
            alert("You win!");
            
            // Increment win count and save it
            let winCount = parseInt(localStorage.getItem("winCount") || "0", 10);
            winCount++;
            localStorage.setItem("winCount", winCount);

            updateProgress(); // Update progress on UI

            // Show arrow key if player reaches 4 wins
            if (winCount >= needWins) {
                document.querySelector(".keyboard-arrow-row").style.display = "block";
            }

            setTimeout(() => location.reload(), 1000);
        }
    }, guessArray.length * 500);
}

// function displayPlayedWords() {
//     const playedWords = JSON.parse(localStorage.getItem("playedWords1") || "[]");
//     const playedBoard = document.getElementById("played-words-board");
//     playedBoard.innerHTML = "";

//     playedWords.forEach(word => {
//         for (let i = 0; i < word.length; i++) {
//             const div = document.createElement("div");
//             div.classList.add("letter-box");

//             div.textContent = word[i].toUpperCase();
            
//             if (word[i] === secretWord[i]) {
//                 div.classList.add("correct");
//             } else if (secretWord.includes(word[i])) {
//                 div.classList.add("present");
//             } else {
//                 div.classList.add("absent");
//             }

//             playedBoard.appendChild(div);
//         }
//     });
// }
function displayPlayedWords() {
    const playedWords = ["vital", "fixer", "pinky", "whale"];
    const pinkLetters = {
        "vital": ["vi"],
        "fixer": ["x"],
        "pinky": ["in"],
        "whale": ["h"]
    };

    const playedBoard = document.getElementById("played-words-board");
    playedBoard.innerHTML = ""; // Clear previous entries

    playedWords.forEach(word => {
        let wordDiv = document.createElement("div");
        wordDiv.classList.add("word-row");

        let colorMap = new Array(word.length).fill("#a7d1fb"); // Default all to blue

        // Mark the pink positions correctly
        pinkLetters[word].forEach(pattern => {
            let index = word.indexOf(pattern);
            if (index !== -1) {
                for (let j = 0; j < pattern.length; j++) {
                    colorMap[index + j] = "#F8C8DC"; // Make the whole sequence pink
                }
            }
        });

        // Create letter boxes with the correct colors
        for (let i = 0; i < word.length; i++) {
            const div = document.createElement("div");
            div.classList.add("letter-box");
            div.textContent = word[i].toUpperCase();
            div.style.backgroundColor = colorMap[i]; // Apply the fixed color mapping

            wordDiv.appendChild(div);
        }

        playedBoard.appendChild(wordDiv);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const firstSection = document.querySelector("#hidden-message");
    const playedWordsContainer = document.querySelector("#played-words-container");
    const hiddenContainer = document.getElementById("hidden-container");
    const arrowDownButton = document.getElementById("arrow-down-button");

    // Delay before fading out the first section
    setTimeout(() => {
        firstSection.classList.add("fade-out");
        playedWordsContainer.classList.add("fade-out");

        // Wait for fade-out to complete, then fade in the second section
        setTimeout(() => {
            hiddenContainer.classList.add("fade-in");
        }, 7000);
    }, 7500); // Wait before animation starts

    if (arrowDownButton) {
        arrowDownButton.onclick = () => {
            document.getElementById("new-section").style.transform = "translateY(-100vh)";
            document.getElementById("new-section").style.opacity = "0";

            // Move the another-section up and fade in
            document.getElementById("final-section").style.transform = "translateY(-100vh)";
            document.getElementById("final-section").style.opacity = "1";

            // displayPlayedWords();

            // Disable scrolling
            // setTimeout(() => {
            //     document.body.style.overflow = "hidden";
            // }, 1000);

            setTimeout(() => {
                window.location.href = "flower.html"; // Redirect after animation
            }, 1000); // Wait 1s before redirecting
        };
    }
});


window.onload = loadWords;
