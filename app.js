import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js"
import { Coin } from "./modules/coin.js"
import { Bullet } from "./modules/bullet.js"
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 350;

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let timeFrame = 0;

const coinArray = [];
const enemyArray = [];
const bullets = [];

//track movement
const move = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tap: false
}

//touch events
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    for (let i = 1; i <= event.touches.length; i++) {
        const angle = Math.atan2((event.touches[i].clientY) - move.y, event.touches[i].clientX - move.x);
        const speed = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        bullets.push(new Bullet(move.x, move.y, { x: speed.x * 10, y: speed.y * 10 }));
    }

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
background.src = 'sky_background_green_hills.png'

// create player
var player = new Player(canvas.width, canvas.height);

function handleCoin() {
    if (timeFrame % 100 == 0) {
        const test = new Coin();
        coinArray.push(test);
    }
    coinArray.forEach(i => {
        i.update(player.x, player.y);
        i.draw(context);
        //remove coin if out of bounds
        if (i.x < 0 - i.radius * 2) {
            setTimeout(() => {
                coinArray.splice(1, i);
            })
        }
        // take obj out of array and increase score
        if (i) {
            if (i.distance < i.radius + player.radius) {
                if (!i.counted)
                    score += 1;
                i.counted = true;
                coinArray.splice(i, 1);
            }
        }
    });
}

//enemy stuff
function handleEnemy() {
    if (score < 5) {
        if (timeFrame % 150 == 0) {
            enemyArray.push(new Enemy());
        }
    }
    else if (6 < score >= 10) {
        if (timeFrame % 100 == 0) {
            enemyArray.push(new Enemy());
        }
    }
    else {
        if (timeFrame % 50 == 0) {
            enemyArray.push(new Enemy());
        }
    }

    enemyArray.forEach(i => {
        i.update(player.x, player.y);
        i.draw(context);
        // remove enemy if out of bounds
        if (i.y < 0 - i.radius * 2) {
            setTimeout(() => {
                enemyArray.splice(y, 1);
            })
        }
        // check for collison with player
        if (i) {
            if (i.distance < i.radius + player.radius) {
                if (!i.counted)
                    score = 0;
            }
        }
        //check for collison with bullet
        bullets.forEach(bullet => {
            const dxBullet = i.x - bullet.x;
            const dyBullet = i.y - bullet.y;
            i.distancebullet = Math.sqrt(dxBullet * dxBullet + dyBullet * dyBullet);
            if (i.distancebullet < i.radius + bullet.radius) {
                enemyArray.splice(i, 1);
            }
        })
    })
}

function animate() {
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
    context.fillText('Score: ' + score, 5, 15);
    timeFrame++;
    requestAnimationFrame(animate);
}

animate();