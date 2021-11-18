// bullets
const bulletImgRight = new Image();
bulletImgRight.src = 'Images/bulletRight.png';
const bulletImgLeft = new Image();
bulletImgLeft.src = 'Images/bulletLeft.png'

export class Bullet {
    constructor(movex, movey, speed, angle) {
        this.x = movex;
        this.y = movey;
        this.radius = 5;
        this.angle = 0;
        this.speed = speed;
        this.imgWidth = 250;
        this.imgHeight = 200;
        this.removalbe = false;
        this.imgWidth = 350;
        this.imgHeight = 350;

        this.angle = angle;
    }
    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if(this.x < 0 - this.radius * 2){
            this.removalbe = true;
        }
    }
    draw(context) {
        context.fillStyle = 'darkgrey';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill()
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if (this.x > this.speed.x) {
            context.drawImage(bulletImgRight, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 30, 0 - 15, this.imgWidth / 4, this.imgHeight / 3);
        }if(this.x < this.speed.x){
            context.drawImage(bulletImgLeft, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 30, 0 - 15, this.imgWidth / 4, this.imgHeight / 3);
        }
        context.restore();
    }
}

export default Bullet