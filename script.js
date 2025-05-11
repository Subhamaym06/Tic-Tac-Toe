// All possible winning combinations in Tic-Tac-Toe
const winnpattern = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal \
    [2, 4, 6]  // Diagonal /
];

// Game state variables and element selectors
let turnx = true;
let turning = turnx;
let boxes = document.querySelectorAll(".box");
let newgame = document.querySelector(".newgame");
let reset = document.querySelector(".reset");
let xname = document.querySelector("#xname");
let oname = document.querySelector("#oname");

// Show mode selection modal on page load
window.onload = function () {
    const modeModal = new bootstrap.Modal(document.getElementById('modeModal'));
    modeModal.show();
};

// Function to choose computer mode and show symbol selection modal
function chooseComputer() {
    const modeModal = bootstrap.Modal.getInstance(document.getElementById('modeModal'));
    modeModal.hide();
    const symbolModal = new bootstrap.Modal(document.getElementById('symbolModal'));
    symbolModal.show();
}

// Display game start modal with message for computer mode
function startcomp(message) {
    document.getElementById('startMessage').textContent = `${message}`;
    let startModal = new bootstrap.Modal(document.getElementById('startModal'));
    startModal.show();
}

// Display game start modal with message for two-player mode
function starthuman(message) {
    document.getElementById('startMessage').textContent = `${message}`;
    let startModal = new bootstrap.Modal(document.getElementById('startModal'));
    startModal.show();
}

// Initialize game with computer opponent based on chosen symbol
function startComputerGame(playerSymbol) {
    const symbolModal = bootstrap.Modal.getInstance(document.getElementById('symbolModal'));
    symbolModal.hide();

    let name = prompt("Enter Your Name");
    startcomp(`${name} vs Computer game started.\n${name} is playing as '${playerSymbol}'`);

    let computerSymbol = playerSymbol === "X" ? "O" : "X";
    let namex, nameo;
    let gameOver = false;

    // Assign player and computer names
    if (playerSymbol === "X") {
        xname.innerHTML = `${name}(X)`;
        oname.innerHTML = `Computer(O)`;
        namex = name;
        nameo = "Computer";
    } else {
        xname.innerHTML = `Computer(X)`;
        oname.innerHTML = `${name}(O)`;
        namex = "Computer";
        nameo = name;
    }

    // Clear and disable all boxes
    boxes.forEach(box => {
        box.innerHTML = "";
        box.disabled = true;
    });

    // New game button handler
    newgame.addEventListener("click", () => {
        newgame.classList.remove("gameover");
        gameOver = false;
        if (turnx) showturn("X");
        else showturn("O");
        boxes.forEach(box => {
            box.innerHTML = "";
            box.disabled = false;
        });
        turning = turnx;
        play();
    });

    // Reset button handler
    reset.addEventListener("click", () => {
        gameOver = false;
        turnx = turning;
        boxes.forEach(box => {
            box.innerHTML = "";
            box.disabled = false;
        });
        if (turning) {
            showres("X");
        } else {
            showres("O");
        }
        if ((playerSymbol === "X" && !turnx) || (playerSymbol === "O" && turnx)) {
            setTimeout(() => {
                play();
            }, 500);
        }
    });

    // Main game loop
    function play() {
        if (gameOver) return;
        let winnerFound = checkwinner();
        if (winnerFound) {
            gameOver = true;
            return;
        }
        let drawFound = checkdraw();
        if (drawFound) {
            gameOver = true;
            return;
        }
        if ((playerSymbol === "X" && turnx) || (playerSymbol === "O" && !turnx)) {
            playHuman();
        } else {
            setTimeout(() => {
                playComputer();
            }, 750);
        }
    }

    // Human player's move logic
    function playHuman() {
        boxes.forEach((box) => {
            if (!box.disabled && box.innerHTML === "") {
                box.disabled = false;
                box.onclick = () => {
                    box.innerHTML = playerSymbol;
                    box.disabled = true;
                    turnx = !turnx;
                    play();
                };
            }
        });
    }

    // Computer player's move logic
    function playComputer() {
        let availableIndices = [];
        boxes.forEach((box, index) => {
            if (!box.disabled && box.textContent === "") {
                availableIndices.push(index);
                console.log(index)
            }
        });
        if (availableIndices.length === 0) return;
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const chosenbox = boxes[randomIndex];
        chosenbox.innerHTML = computerSymbol;
        chosenbox.disabled = true;
        turnx = !turnx;
        play();
    }

    // Check for a winning condition
    function checkwinner() {
        for (let pattern of winnpattern) {
            let box0 = boxes[pattern[0]].innerHTML;
            let box1 = boxes[pattern[1]].innerHTML;
            let box2 = boxes[pattern[2]].innerHTML;
            if (box0 === "X" || box0 === "O") {
                if (box0 === box1 && box1 === box2) {
                    document.querySelector(`#${box0}`).innerHTML = parseInt(document.querySelector(`#${box0}`).innerHTML) + 1;
                    showwinner(box0);
                    return true;
                }
            }
        }
        return false;
    }

    // Check for a draw condition
    function checkdraw() {
        let allFilled = Array.from(boxes).every(box => box.innerHTML === "X" || box.innerHTML === "O");
        if (allFilled) {
            showdraw();
            return true;
        }
        return false;
    }

    // Display winner modal
    function showwinner(winner) {
        document.getElementById('winnerMessage').textContent = `${winner === "X" ? namex : nameo} wins!`;
        let winModal = new bootstrap.Modal(document.getElementById('winModal'));
        newgame.classList.add("gameover");
        boxes.forEach(box => box.disabled = true);
        winModal.show();
    }

    // Display draw modal
    function showdraw() {
        document.getElementById('winnerMessage').textContent = `Game Draw!`;
        let winModal = new bootstrap.Modal(document.getElementById('winModal'));
        newgame.classList.add("gameover");
        boxes.forEach(box => box.disabled = true);
        winModal.show();
    }

    // Show turn message modal
    function showturn(turn) {
        document.getElementById('turnMessage').textContent = `${turn === "X" ? namex : nameo}'s Turn`;
        let turnModal = new bootstrap.Modal(document.getElementById('turnModal'));
        boxes.forEach(box => box.disabled = false);
        turnModal.show();
    }

    // Show turn on reset
    function showres(turn) {
        document.getElementById('resMessage').textContent = `${turn === "X" ? namex : nameo}'s Turn`;
        let resModal = new bootstrap.Modal(document.getElementById('resModal'));
        boxes.forEach(box => box.disabled = false);
        resModal.show();
    }
}

// Initialize two-player game
function startTwoPlayerGame() {
    const modeModal = bootstrap.Modal.getInstance(document.getElementById('modeModal'));
    modeModal.hide();
    let namex = prompt("Enter the name of the player playing as 'X'");
    let nameo = prompt("Enter the name of the player playing as 'O'");
    starthuman(`${namex} vs ${nameo} game started.\n${namex} is playing as 'X'\n${nameo} is playing as 'O'`);
    xname.innerHTML = `${namex}(X)`;
    oname.innerHTML = `${nameo}(O)`;
    let gameOver = false;

    // Initially disable boxes
    boxes.forEach(box => box.disabled = true);

    // New game handler
    newgame.addEventListener("click", () => {
        newgame.classList.remove("gameover");
        gameOver = false;
        if (turnx) showturn("X");
        else showturn("O");
        boxes.forEach(box => {
            box.innerHTML = "";
            box.disabled = false;
        });
        turning = turnx;
    });

    // Reset handler
    reset.addEventListener("click", () => {
        gameOver = false;
        turnx = turning;
        boxes.forEach(box => {
            box.innerHTML = "";
            box.disabled = false;
        });
        if (turning) showres("X");
        else showres("O");
    });

    // Handle box clicks and switch turns
    boxes.forEach(box => {
        box.addEventListener("click", () => {
            box.innerHTML = turnx ? "X" : "O";
            turnx = !turnx;
            box.disabled = true;
            let winnerFound = checkwinner();
            if (!winnerFound) checkdraw();
        });
    });

    // Check winner
    function checkwinner() {
        for (let pattern of winnpattern) {
            let box0 = boxes[pattern[0]].innerHTML;
            let box1 = boxes[pattern[1]].innerHTML;
            let box2 = boxes[pattern[2]].innerHTML;
            if (box0 === "X" || box0 === "O") {
                if (box0 === box1 && box1 === box2) {
                    document.querySelector(`#${box0}`).innerHTML = parseInt(document.querySelector(`#${box0}`).innerHTML) + 1;
                    showwinner(box0);
                    return true;
                }
            }
        }
        return false;
    }

    // Check draw
    function checkdraw() {
        let allFilled = Array.from(boxes).every(box => box.innerHTML === "X" || box.innerHTML === "O");
        if (allFilled) {
            showdraw();
            return true;
        }
        return false;
    }

    // Show winner modal
    function showwinner(winner) {
        document.getElementById('winnerMessage').textContent = `${winner === "X" ? namex : nameo} wins!`;
        let winModal = new bootstrap.Modal(document.getElementById('winModal'));
        newgame.classList.add("gameover");
        boxes.forEach(box => box.disabled = true);
        winModal.show();
    }

    // Show draw modal
    function showdraw() {
        document.getElementById('winnerMessage').textContent = `Game Draw!`;
        let winModal = new bootstrap.Modal(document.getElementById('winModal'));
        newgame.classList.add("gameover");
        boxes.forEach(box => box.disabled = true);
        winModal.show();
    }

    // Show turn modal
    function showturn(turn) {
        document.getElementById('turnMessage').textContent = `${turn === "X" ? namex : nameo}'s Turn`;
        let turnModal = new bootstrap.Modal(document.getElementById('turnModal'));
        boxes.forEach(box => box.disabled = false);
        turnModal.show();
    }

    // Show reset turn modal
    function showres(turn) {
        document.getElementById('resMessage').textContent = `${turn === "X" ? namex : nameo}'s Turn`;
        let resModal = new bootstrap.Modal(document.getElementById('resModal'));
        boxes.forEach(box => box.disabled = false);
        resModal.show();
    }
}