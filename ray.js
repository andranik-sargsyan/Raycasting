class Ray {
    constructor(x1, y1, angle) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = undefined;
        this.y2 = undefined;
        this.angle = angle;
    }

    draw() {
        if (!this.x2 || !this.y2) {
            return;
        }

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.strokeStyle = "black";
    }
}