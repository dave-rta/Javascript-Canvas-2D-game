//Player Images
const playerLeft = new Image();
playerLeft.src = 'Images/plane_2_blue_left.png';
const playerRight = new Image();
playerRight.src = 'Images/plane_2_blue_right.png';

//Player stuff
export class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 25;
        this.angle = 0;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    update(move) {
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
    draw(context, move) {
        //"Hit-box"
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        //rotate image to face movement
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if (this.x > move.x) {
            context.drawImage(playerLeft, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 60, 0 - 40, this.imgWidth / 4, this.imgHeight / 3);
        } else {
            context.drawImage(playerRight, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 60, 0 - 30, this.imgWidth / 4, this.imgHeight / 3);
        }
        context.restore();
    }
}

export default Player