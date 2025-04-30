// Game Constants & Variables  
let inputDir = { x: 0, y: 0 };  
const foodSound = new Audio('music/food.mp3');  
const gameOverSound = new Audio('music/gameover.mp3');  
const moveSound = new Audio('music/move.mp3');  
const musicSound = new Audio('music/music.mp3');  

let speed = 9;  
let score = 0;  
let lastPaintTime = 0;  
let snakeArr = [  
    { x: 13, y: 15 }  
];  

let food = { x: 6, y: 7, color: "red" }; // food has a color  
let snakeColor = "green"; // default snake color  

// DOM Elements (Ensure these exist in your HTML)  
const board = document.getElementById('board');  
const scoreBox = document.getElementById('scoreBox');  
const hiscoreBox = document.getElementById('hiscoreBox');  

function main(ctime) {  
    window.requestAnimationFrame(main);  
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {  
        return;  
    }  
    lastPaintTime = ctime;  
    gameEngine();  
}  

function isCollide(snake) {  
    // Check self-collision  
    for (let i = 1; i < snake.length; i++) {  
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {  
            return true;  
        }  
    }  
    // Check wall collision  
    if (snake[0].x < 0 || snake[0].x >= 18 || snake[0].y < 0 || snake[0].y >= 18) {  
        return true;  
    }  
    return false;  
}  

function gameEngine() {  
    // Check game over  
    if (isCollide(snakeArr)) {  
        gameOverSound.play();  
        inputDir = { x: 0, y: 0 };  
        alert("Game Over! Press any key to play again.");  
        snakeArr = [{ x: 13, y: 15 }];  
        score = 0;  
        scoreBox.innerHTML = "Score: " + score;  
        snakeColor = "green"; // Reset color  
        return;  
    }  

    // Update high score  
    if (score > hiscoreval) {  
        hiscoreval = score;  
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));  
        hiscoreBox.innerHTML = "HiScore: " + hiscoreval;  
    }  
    scoreBox.innerHTML = "Score: " + score;  

    // Move snake  
    snakeArr.unshift({  
        x: snakeArr[0].x + inputDir.x,  
        y: snakeArr[0].y + inputDir.y  
    });  

    // Check if food eaten  
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {  
        score += 1;  
        foodSound.play();  

        // Generate new food with random position and color  
        const colors = ["red", "blue", "green", "yellow"]; // you can extend  
        const randColor = colors[Math.floor(Math.random() * colors.length)];  
        const a = 2, b = 16;  
        food = {  
            x: Math.round(a + (b - a) * Math.random()),  
            y: Math.round(a + (b - a) * Math.random()),  
            color: randColor  
        };  

        // Change snake's color to the food's color on eating  
        snakeColor = food.color;  
    } else {  
        // Remove tail  
        snakeArr.pop();  
    }  

    // Clear board  
    board.innerHTML = "";  

    // Draw snake  
    snakeArr.forEach((e, index) => {  
        const snakeElement = document.createElement('div');  
        snakeElement.style.gridRowStart = e.y;  
        snakeElement.style.gridColumnStart = e.x;  
        snakeElement.style.backgroundColor = snakeColor;  
        if (index === 0) {  
            snakeElement.classList.add('head');  
        } else {  
            snakeElement.classList.add('snake');  
        }  
        board.appendChild(snakeElement);  
    });  

    // Draw food  
    const foodElement = document.createElement('div');  
    foodElement.style.gridRowStart = food.y;  
    foodElement.style.gridColumnStart = food.x;  
    foodElement.classList.add('food');  
    foodElement.style.backgroundColor = food.color;  
    board.appendChild(foodElement);  
}  

// Initialize game  
musicSound.play();  
let hiscore = localStorage.getItem("hiscore");  
let hiscoreval;  

if (hiscore === null) {  
    hiscoreval = 0;  
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));  
} else {  
    hiscoreval = JSON.parse(hiscore);  
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;  
}  

window.requestAnimationFrame(main);  

// Handle keyboard events  
window.addEventListener('keydown', e => {  
    if (inputDir.x === 0 && inputDir.y === 0) {  
        inputDir = { x: 0, y: 1 };  
    }  
    moveSound.play();  
    switch (e.key) {  
        case "ArrowUp":  
            if (inputDir.y !== 1) {  
                inputDir.x = 0;  
                inputDir.y = -1;  
            }  
            break;  
        case "ArrowDown":  
            if (inputDir.y !== -1) {  
                inputDir.x = 0;  
                inputDir.y = 1;  
            }  
            break;  
        case "ArrowLeft":  
            if (inputDir.x !== 1) {  
                inputDir.x = -1;  
                inputDir.y = 0;  
            }  
            break;  
        case "ArrowRight":  
            if (inputDir.x !== -1) {  
                inputDir.x = 1;  
                inputDir.y = 0;  
            }  
            break;  
    }  
});  