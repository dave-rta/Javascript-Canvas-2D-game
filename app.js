import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js"
import { Coin } from "./modules/coin.js"
import { Bullet } from "./modules/bullet.js"
import { Restart } from "./modules/restart.js";
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 300;

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let oldScore = 0;
let timeFrame = 0;
let level = 0;
let gameOver = false;

let coinArray = [];
let enemyArray = [];
let bulletArray = [];

//track movement
const move = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tap: false
}

//touch events
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    if (gameOver) {
        checkForRestart(event.touches[0].clientX, event.touches[0].clientY);
    }
    // bullet direction, shooting only possible if plane is moving
    const angle = Math.atan2(event.touches[1].clientY - move.y, event.touches[1].clientX - move.x);
    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    bulletArray.push(new Bullet(move, { x: speed.x * 10, y: speed.y * 10 }, angle));
}, false);
canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    // follow finger movement
    move.x = event.touches[0].clientX - canvasPosition.left;
    move.y = event.touches[0].clientY - canvasPosition.top;
    move.tap = true;
}, false)
canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    move.tap = false;
}, false)

//background image
const background = new Image();
background.src = 'Images/sky_background_green_hills.png'

// create player
var player = new Player();
var restart = new Restart();

function handleCoin() {
    // spawn new coins
    if (timeFrame % 100 == 0) {
        coinArray.push(new Coin());
    }
    //draw and update coin
    coinArray.forEach(coin => {
        coin.update(player.x, player.y);
        coin.draw(context);
        //mark as removable if out of bounds
        if (coin.x < 0 - coin.radius * 2) {
            coin.removable = true;
        }
        // check for collison with player
        if (coin) {
            if (coin.distance < coin.radius + player.radius) {
                if (!coin.counted)
                    score += 1;
                coin.counted = true;
                coin.removable = true;
            }
        }
    });
    removeFromArray(coinArray);
}

//enemy stuff
function handleEnemy() {
    // spawn new enemies depending on score
    if (score <= 5) {
        level = 1;
        if (timeFrame % 150 == 0) {
            enemyArray.push(new Enemy(0));
        }
    }
    else if (5 < score && score <= 20) {
        level = 2;
        if (timeFrame % 100 == 0) {
            enemyArray.push(new Enemy(0));
        }
    }
    // enemies from left start appearing
    else if (20 < score && score <= 40) {
        level = 3;
        if (timeFrame % 150 == 0) {
            enemyArray.push(new Enemy(0));
            enemyArray.push(new Enemy(1));
        }
    }
    else if (score > 40) {
        level = 4;
        if (timeFrame % 100 == 0) {
            enemyArray.push(new Enemy(0));
            enemyArray.push(new Enemy(1));
        }
    }
    checkIfRemovable(enemyArray);

    removeFromArray(enemyArray);
    removeFromArray(bulletArray);
}

function checkIfRemovable(array) {
    array.forEach(enemy => {
        enemy.update(player.x, player.y);
        enemy.draw(context);
        // mark as removable if out of bounds
        if (enemy.y < 0 - enemy.radius * 2) {
            enemy.removable = true;
        }
        // check for collison with player
        if (enemy) {
            if (enemy.distance < enemy.radius + player.radius) {
                if (!enemy.counted) {
                    oldScore = score;
                    score = 0;
                    gameOver = true;
                }
            }
        }
        //check for collison with bullet
        bulletArray.forEach(bullet => {
            const dxBullet = enemy.x - bullet.x;
            const dyBullet = enemy.y - bullet.y;
            enemy.distancebullet = Math.sqrt(dxBullet * dxBullet + dyBullet * dyBullet);
            if (enemy.distancebullet < enemy.radius + bullet.radius) {
                score += 1;
                enemy.removable = true;
                bullet.removable = true;
            }
        })
    });
}

// remove enemy/coin out of array
function removeFromArray(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].removable) {
            setTimeout(() => {
                array.splice(i, 1);
            })
        }
    }
}

// set game back to start conditions
function checkForRestart(x, y) {
    // check if touch is in circle
    if (Math.sqrt((restart.x - x + 40) * (restart.x - x + 40) + (restart.y - y + 20) * (restart.y - y + 20)) < restart.radius) {
        gameOver = false;
        level = 1;
        score = 0;
        player.x = canvas.width;
        player.y = canvas.height / 2;
        coinArray = [];
        enemyArray = [];
        bulletArray = [];
    }
}

function animate() {
    // while playing
    if (!gameOver) {
        // game stuff
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        handleCoin();
        handleEnemy();
        player.update(move);
        player.draw(context, move);
        bulletArray.forEach((bullet) => {
            bullet.update();
            bullet.draw(context);
        })
        // score and level display
        context.fillStyle = 'black';
        context.font = "15px Arial";
        context.fillText('Score: ' + score, 5, 20);
        context.fillText('Level ' + level, canvas.width / 2 - 20, 20);
        timeFrame++;
    }
    // restart stuff
    else {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        restart.draw(context, oldScore);
    }
    requestAnimationFrame(animate);
}

animate();