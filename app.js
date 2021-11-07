const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let canvasPosition = canvas.getBoundingClientRect();

let score = 0;
let timeFrame = 0;

//track movement
const move = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tap: false
}

const bullets = [];

//touch events
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    // canvas height offset????
    const angle = Math.atan2((event.touches[0].clientY - 290) - move.y, event.touches[0].clientX - move.x);
    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bullets.push(new Bullet({ x: speed.x * 10, y: speed.y * 10 }));
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

//Player Images
const playerLeft = new Image();
playerLeft.src = 'plane_2_blue_left.png';
const playerRight = new Image();
playerRight.src = 'plane_2_blue_right.png';

// enemy image
const enemyImg = new Image();
enemyImg.src = 'plane_2_red.png';

// coin image
const coinImg = new Image();
coinImg.src = 'coin.png'

//background image
const background = new Image();
background.src = 'sky_background_green_hills.png'

//Player stuff
class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 40;
        this.angle = 0;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    update() {
        const dx = this.x - move.x;
        const dy = this.y - move.y;
        // angle to face tap direction
        this.angle = Math.atan2(dy, dx);

        if (move.x != this.x) {
            this.x -= dx / 30;
        }
        if (move.y != this.y) {
            this.y -= dy / 30;
        }
    }
    draw() {
        if (move.tap) {
            context.lineWidth = 0.2;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(move.x, move.y);
            context.stroke();
        }
        //"Hit-box"
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        //rotate image to face movement
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if (this.x > move.x) {
            //check if correct (img, next 4 area of pic, last 4 dest of image)
            context.drawImage(playerLeft, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 70, 0 - 50, this.imgWidth / 4, this.imgHeight / 3);
        } else {
            //check if correct (img, next 4 area of pic, last 4 dest of image)
            context.drawImage(playerRight, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 70, 0 - 50, this.imgWidth / 4, this.imgHeight / 3);
        }
        context.restore();
    }
}

// create player
const player = new Player();

//coin stuff
const coinArray = [];
class Coin {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 + Math.random() * canvas.height;
        this.radius = 30;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.imgWidth = 350;
        this.imgHeight = 300;
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        context.fillStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.drawImage(coinImg, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, this.x - 40, this.y - 35, this.imgWidth / 4, this.imgHeight / 3);
    }
}

function handleCoin() {
    if (timeFrame % 100 == 0) {
        const test = new Coin();
        coinArray.push(test);
    }
    coinArray.forEach(i => {
        i.update();
        i.draw();
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
const enemyArray = [];
class Enemy {
    constructor() {
        this.x = canvas.width - 100 + Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 40;
        this.speed = Math.random() * 10 + 1;
        this.distance;
        this.distancebullet;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    update() {
        this.x -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        bullets.forEach(bullet => {
            const dxBullet = this.x - bullet.x;
            const dyBullet = this.y - bullet.y;
            this.distancebullet = Math.sqrt(dxBullet * dxBullet + dyBullet * dyBullet);
        })
    }
    draw() {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.drawImage(enemyImg, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, this.x - 70, this.y - 50, this.imgWidth / 4, this.imgHeight / 3);
    }
}

function handleEnemy() {
    if (timeFrame % 150 == 0) {
        enemyArray.push(new Enemy());
    }
    enemyArray.forEach(i => {
        i.update();
        i.draw();
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
            if (i.distancebullet < i.radius + bullet.radius) {
                enemyArray.splice(i, 1);
                console.log("hit");
            }
        })
    })
}

// bullets
class Bullet {
    constructor(speed) {
        this.x = move.x;
        this.y = move.y;
        this.radius = 10;
        this.angle = 0;
        this.speed = speed;
        this.imgWidth = 250;
        this.imgHeight = 200;
    }
    update() {
        const dx = this.x - this.speed.x;
        const dy = this.y - this.speed.y;
        // angle to face tap direction
        this.angle = Math.atan2(dx, dy);
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
    draw() {
        context.fillStyle = 'darkgrey';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill()
        context.closePath();
    }
}


function animate() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    handleCoin();
    handleEnemy();
    player.update();
    player.draw();
    bullets.forEach((bullet) => {
        bullet.update();
        bullet.draw();
    })
    context.fillStyle = 'black';
    context.fillText('Score: ' + score, 5, 15);
    timeFrame++;
    requestAnimationFrame(animate);
}

animate();