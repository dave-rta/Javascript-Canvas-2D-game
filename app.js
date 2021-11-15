import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js"
import { Coin } from "./modules/coin.js"
import { Bullet } from "./modules/bullet.js"
import { Restart } from "./modules/restart.js";
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 350;

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let timeFrame = 0;
let level = 0;
let gameOver = false;

let coinArray = [];
let enemyArray = [];
let bullets = [];

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
        checkForRestart(event.touches[0].clientX - canvasPosition.left, event.touches[0].clientY - canvasPosition.top);
    }
    const angle = Math.atan2((event.touches[1].clientY) - move.y, event.touches[1].clientX - move.x);
    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bullets.push(new Bullet(move.x, move.y, { x: speed.x * 10, y: speed.y * 10 }));

}, false);
canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    move.tap = true;
    move.x = event.touches[0].clientX - canvasPosition.left;
    move.y = event.touches[0].clientY - canvasPosition.top;

}, false)
canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    move.tap = false;
})

//background image
const background = new Image();
background.src = 'Images/sky_background_green_hills.png'

// create player
var player = new Player();
var restart = new Restart();

function handleCoin() {
    if (timeFrame % 100 == 0) {      //change back later
        coinArray.push(new Coin());
    }
    coinArray.forEach(coin => {
        coin.update(player.x, player.y);
        coin.draw(context);
        //splice coin if out of bounds
        if (coin.x < 0 - coin.radius * 2) {
            coin.removable = true;
        }
        // take obj out of array and increase score
        if (coin) {
            if (coin.distance < coin.radius + player.radius) {
                if (!coin.counted)
                    score += 1;
                coin.counted = true;
                coin.removable = true;
            }
        }
    });
    removeCoins();
}

function removeCoins() {
    for (let i = 0; i < coinArray.length; i++) {
        if (coinArray[i].removable) {
            setTimeout(() => {
                coinArray.splice(i, 1);
            })
        }
    }
}

//enemy stuff
function handleEnemy() {
    if (score <= 5) {
        if (timeFrame % 150 == 0) {
            enemyArray.push(new Enemy());
            level = 1;
        }
    }
    else if (5 < score && score <= 15) {
        level = 2;
        if (timeFrame % 100 == 0) {
            enemyArray.push(new Enemy());
        }
    }
    else if (score > 15) {
        level = 3;
        if (timeFrame % 50 == 0) {
            enemyArray.push(new Enemy());
        }
    }

    enemyArray.forEach(enemy => {
        enemy.update(player.x, player.y);
        enemy.draw(context);
        // splice enemy if out of bounds
        if (enemy.y < 0 - enemy.radius * 2) {
            enemy.removable = true;
        }
        // check for collison with player
        if (enemy) {
            if (enemy.distance < enemy.radius + player.radius) {
                if (!enemy.counted)
                    score = 0;
                gameOver = true;
            }
        }
        //check for collison with bullet
        bullets.forEach(bullet => {
            const dxBullet = enemy.x - bullet.x;
            const dyBullet = enemy.y - bullet.y;
            enemy.distancebullet = Math.sqrt(dxBullet * dxBullet + dyBullet * dyBullet);
            if (enemy.distancebullet < enemy.radius + bullet.radius) {
                enemy.removable = true;
                bullet.removable = true;
            }
        })
    });
    removeEnemy();
    removeBullet();
}

function removeEnemy() {
    for (let i = 0; i < enemyArray.length; i++) {
        if (enemyArray[i].removable) {
            setTimeout(() => {
                enemyArray.splice(i, 1);
            })
        }
    }
}

function removeBullet(){
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].removable) {
            setTimeout(() => {
                bullets.splice(i, 1);
            })
        }
    }
}

function checkForRestart(x, y) {
    if (Math.sqrt((restart.x - x) * (restart.x - x) + (restart.y - y) * (restart.y - y)) < restart.radius) {
        gameOver = false;
        score = 0;
        level = 1;
        player.x = canvas.width;
        player.y = canvas.height / 2;
        coinArray = [];
        enemyArray = [];
        bullets = [];
    }
}

function animate() {
    if (!gameOver) {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        handleCoin();
        handleEnemy();
        player.update(move.x, move.y);
        player.draw(context, move.x);
        bullets.forEach((bullet) => {
            bullet.update();
            bullet.draw(context);
        })
        context.fillStyle = 'black';
        context.font = "15px Arial";
        context.fillText('Score: ' + score, 5, 20);
        context.fillText('Level ' + level, canvas.width / 2 - 20, 20);

        timeFrame++;
    } else {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        restart.draw(context, score);
    }
    requestAnimationFrame(animate);
}

animate();