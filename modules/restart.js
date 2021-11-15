const restartImg = new Image();
restartImg.src = 'Images/circle.png';
export class Restart {
    constructor() {
        this.x = 400;
        this.y = 175;
        this.radius = 50;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    draw(context, score) {
        context.fillStyle = "black";
        context.fillText('You lost. Your Score was: ' + score, canvas.width / 2 - 100, canvas.height / 4);
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.drawImage(restartImg, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, this.x - 55, this.y - 45, this.imgWidth / 4, this.imgHeight / 3);
        context.fillText('Restart', 377, 180)
    }
}

export default Restart