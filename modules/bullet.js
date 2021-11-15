// bullets
export class Bullet {
    constructor(movex, movey, speed) {
        this.x = movex;
        this.y = movey;
        this.radius = 5;
        this.angle = 0;
        this.speed = speed;
        this.imgWidth = 250;
        this.imgHeight = 200;
        this.removalbe = false;
    }
    update() {
        const dx = this.x - this.speed.x;
        const dy = this.y - this.speed.y;
        this.angle = Math.atan2(dx, dy);
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
    draw(context) {
        context.fillStyle = 'darkgrey';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill()
        context.closePath();
    }
}

export default Bullet