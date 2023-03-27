// Declaring the variables to hold the elements
const gameBoard = document.querySelector("#gameBoard")
const ctx = gameBoard.getContext("2d")
const startBtn = document.querySelector("#startBtn")

// Storing these values for quick access
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height

// Colours for game objects
const boardBackground = "forestgreen"
const paddle1Colour = "#4287f5"
const paddle2Colour = "red"
const paddleBorder = "black"
const ballColour = "yellow"
const ballBorderColour = "black"

// Constant distance and size of ball (in pixels)
const ballRadius = 12.5
const paddleDistance = 50

let hasStarted = false
let intervalID // Time in milliseconds before next iteration
let ballSpeed = 1
let ballX = gameWidth / 2  // Initial ball position
let ballY = gameHeight / 2
let ballXDirection = 0     // Direction the ball will go
let ballYDirection = 0
let player1Score = 0       // Players scores
let player2Score = 0

// Paddle Objects
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
}

let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25, // Initial position to draw shape (if just gameWidth it would overflow)
    y: gameHeight - 100 // To start at the bottom right
}

window.addEventListener("keydown", changeDirection)
startBtn.addEventListener("click", () => {
    if (hasStarted) {
        gameStart()
        hasStarted = true
    }
    else {
        resetGame()
    }
})

initializeBoard()

function initializeBoard() {
    drawBoard()
    drawPaddles()
    drawBall(gameWidth / 2, gameHeight / 2)
}

function gameStart() {
    setupBall()
    nextTick()
}

function nextTick() {
    intervalID = setTimeout(() => {
        drawBoard()  // If not in the loop the ball will leave afterimages
        drawPaddles()
        moveBall()
        drawBall(ballX, ballY)
        checkCollision()
        nextTick()
    }, 10)  // After 10 milliseconds do the above - we recall it
}

function drawBoard() {
    ctx.fillStyle = boardBackground
    ctx.fillRect(0, 0, gameWidth, gameHeight)

    ctx.font = "30px impact"    
    ctx.fillStyle = "black"
    ctx.fillText(player1Score, gameWidth / 4, gameHeight / 8)
    ctx.fillStyle = "black"
    ctx.fillText(player2Score, gameWidth - (gameWidth / 4), gameHeight / 8)

    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.setLineDash([19, 30]) // Line of length 5 and a space of 15 pixels
    ctx.moveTo(gameWidth / 2, 0)
    ctx.lineTo(gameWidth / 2, gameHeight)
    ctx.stroke()
    ctx.setLineDash([])
}

function drawPaddles() {
    ctx.lineWidth = 2
    ctx.strokeStyle = paddleBorder

    ctx.fillStyle = paddle1Colour
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height)   // Inner rectangle
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height) // Border for rectangle

    ctx.fillStyle = paddle2Colour
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height)   // Inner rectangle
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height) // Border for rectangle
}

function setupBall() {
    ballSpeed = 1

    // Pick a direction for ball to go
    if (Math.round(Math.random()) === 1) { // Pick a random number between 0 and 1 to pick which side to go (x-coordinate)
        ballXDirection = 1
    }
    else {
        ballXDirection = -1
    }
    if (Math.round(Math.random()) === 1) { // Pick a random number between 0 and 1 to pick which side to go (y-coordinate)
        ballYDirection = 1
    }
    else {
        ballYDirection = -1
    }

    // Ball Starting point
    ballX = gameWidth / 2
    ballY = gameHeight / 2
    drawBall(ballX, ballY)
}

function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColour
    ctx.strokeStyle = ballBorderColour
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
}

function moveBall() {
    // ballSpeed increases upon hitting a paddle and ballXDirection or ballYDirection can be either -1 or 1
    ballX += ballSpeed * ballXDirection
    ballY += ballSpeed * ballYDirection
}

function checkCollision() {
    if (ballY <= 0 + ballRadius) { // If ball hits top border
        ballYDirection *= -1 // Flips the direction by going the other way (1 *= -1 => -1; -1 *= -1 => 1)
    }

    if (ballY >= gameHeight - ballRadius) { // If ball hits bottom border
        ballYDirection *= -1
    }

    if (ballX <= 0) { // If ball hits left border
        player2Score++
        setupBall()
        return
    }

    if (ballX >= gameWidth) { // If ball hits right border
        player1Score++
        setupBall()
        return
    }

    if (ballX <= (paddle1.x + paddle1.width + ballRadius)) { // If the ball is within x coordinates between the left border and the paddle plus ball radius
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) { // If the ball is within the same y coordinates as the paddle
            ballX = (paddle1.x + paddle1.width) + ballRadius // if ball gets stuck
            ballXDirection *= -1 // Change Direction
            ballSpeed += 1
        }
    }

    if (ballX >= (paddle2.x - ballRadius)) { // If the ball is within x coordinates between the right border and the paddle plus ball
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) { // If the ball is within the same y coordinates as the paddle
            ballX = paddle2.x - ballRadius // If ball gets stuck
            ballXDirection *= -1 // Change Direction
            ballSpeed += 1
        }
    }
}

// Moving the paddles
function changeDirection(event) {
    const keyPressed = event.keyCode // keyCode different to key and is the integer representation of the key
    
    // Player 1: W (up) and S (down)
    const paddle1Up = 87
    const paddle1Down = 83

    // Player 2: Up Arrow (up) and Down Arrow (down)
    const paddle2Up = 38
    const paddle2Down = 40

    switch(keyPressed) {
        case paddle1Up:
            if (paddle1.y > 0) {
                paddle1.y -= paddleDistance
            }
            break
        case paddle1Down:
            if (paddle1.y < gameHeight - paddle1.height) { // Do this since y is the top right corner
                paddle1.y += paddleDistance
            }
            break
        case paddle2Up:
            if (paddle2.y > 0) {
                paddle2.y -= paddleDistance
            }
            break
        case paddle2Down:
            if (paddle2.y < gameHeight - paddle2.height) { // Do this since y is the top right corner
                paddle2.y += paddleDistance
            }
            break
    }
}

function resetGame() {
    player1Score = 0
    player2Score = 0
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    }
    
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    }

    ballSpeed = 1
    ballX = 0
    ballY = 0
    ballXDirection = 0
    ballYDirection = 0
    clearInterval(intervalID) // Stops the ticking in nextTick
    gameStart()
}
