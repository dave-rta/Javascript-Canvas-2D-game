// enemy image
const enemyImg = new Image();
enemyImg.src = 'plane_2_red.png';

export class Enemy {
    constructor() {
        this.x = canvas.width - 100 + Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 25;
        this.speed = Math.random() * 10 + 1;
        this.distance;
        this.distancebullet;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    update(playerx, playery) {
        this.x -= this.speed;
        const dx = this.x - playerx;
        const dy = this.y - playery;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.drawImage(enemyImg, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, this.x - 60, this.y - 40, this.imgWidth / 4, this.imgHeight / 3);
    }
}

export default Enemy