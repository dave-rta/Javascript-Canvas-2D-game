//Player Images
const playerLeft = new Image();
playerLeft.src = 'plane_2_blue_left.png';
const playerRight = new Image();
playerRight.src = 'plane_2_blue_right.png';

//Player stuff
export class Player {
    constructor(width, height) {
        this.x = width;
        this.y = height / 2;
        this.radius = 25;
        this.angle = 0;
        this.imgWidth = 550;
        this.imgHeight = 500;
    }

    update(movex, movey) {
        const dx = this.x - movex;
        const dy = this.y - movey;
        // angle to face tap direction
        this.angle = Math.atan2(dy, dx);
        if (movex != this.x) {
            this.x -= dx / 30;
        }
        if (movey != this.y) {
            this.y -= dy / 30;
        }

    }
    draw(context, movex) {
        //"Hit-box"
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();

        //rotate image to face movement
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        if (this.x > movex) {
            context.drawImage(playerLeft, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 60, 0 - 40, this.imgWidth / 4, this.imgHeight / 3);
        } else {
            context.drawImage(playerRight, 0 * this.imgWidth, 0 * this.imgWidth, this.imgHeight, this.imgWidth, 0 - 60, 0 - 30, this.imgWidth / 4, this.imgHeight / 3);
        }
        context.restore();
    }
}

export default Player