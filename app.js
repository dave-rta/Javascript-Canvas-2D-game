const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let timeFrame = 0;

const move = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    tap: false
}

const bullets = [];

//Top left 0:0
let canvasPosition = canvas.getBoundingClientRect();
//touch events
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    // canvas height offset????
    const angle = Math.atan2((event.touches[0].clientY - 290) - move.y , event.touches[0].clientX - move.x);
    console.log(angle);
    const speed = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bullets.push(new Bullet({x: speed.x * 5, y: speed.y * 5}));
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

//Player class
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

        //rotate image to face tap
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if (this.x > move.x) {
            //check if correct (img, next 4 area of pic, last 4 dest of image)
            context.drawImage(playerLeft, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 70, 0 - 50, this.imgWidth / 4, this.imgHeight / 3);
        } else {
            //check if correct (img, next 4 area of pic, last 4 dest of image)
            context.drawImage(playerRight, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 75, 0 - 50, this.imgWidth / 4, this.imgHeight / 3);
        }
        context.restore();
    }
}

const player = new Player();

const coinArray = [];
class Coin {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 + Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
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
        context.fill();
        context.stroke();
        context.closePath();
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
        if (i.x < 0 - i.radius * 2) {
            setTimeout(() => {
                coinArray.splice(x, 1);
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


const enemyArray = [];
class Enemy {
    constructor() {
        this.x = canvas.width - 100 + Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.closePath();
    }
}

function handleEnemy() {
    if (timeFrame % 150 == 0) {
        const test = new Enemy();
        enemyArray.push(test);
    }
    enemyArray.forEach(i => {
        i.update();
        i.draw();
        // take obj out of array
        if (i.y < 0 - i.radius * 2) {
            setTimeout(() => {
                enemyArray.splice(i, 1);
            })
        }
    })
}

// bullets
class Bullet {
    constructor(speed) {
        this.x = move.x;
        this.y = move.y;
        this.radius = 10;
        this.speed = speed;
    }
    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
    draw() {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill()
        context.closePath();
    }
}


function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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