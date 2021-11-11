// coin image
const coinImg = new Image();
coinImg.src = 'coin.png'

//coin stuff
export class Coin {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 + Math.random() * canvas.height;
        this.radius = 20;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.imgWidth = 350;
        this.imgHeight = 300;
    }
    update(playerx, playery) {
        this.y -= this.speed;
        const dx = this.x - playerx;
        const dy = this.y - playery;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.drawImage(coinImg, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, this.x - 40, this.y - 35, this.imgWidth / 4, this.imgHeight / 3);
    }
} 

export default Coin