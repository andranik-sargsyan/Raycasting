class Player {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.rays = [];
        this.speed = 5;
        this.fov = 90;
        this.angleStep = 0.5;
        for (let i = -this.fov / this.angleStep / 2; i <= this.fov / this.angleStep / 2; i++) {
            this.rays.push(new Ray(x, y, this.angle + i * this.angleStep * Math.PI / 180));
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 30 * Math.cos(this.angle), this.y - 30 * Math.sin(this.angle));
        ctx.stroke();

        for (let ray of this.rays) {
            ray.draw();
        }
    }

    draw3D() {
        for (let i = 0; i < this.rays.length; i++) {
            let ray = this.rays[i];
            let width = canvas3D.width / this.rays.length;
            let height = 100 * canvas3D.height / (ray.length * Math.cos((this.fov / 2 - i * this.angleStep) * Math.PI / 180));

            ctx3D.beginPath();
            ctx3D.rect((this.rays.length - i - 1) * width, canvas3D.height / 2 - height / 2, width, height);

            let light = 2 * height / canvas3D.height;
            if (light > 1) {
                light = 1;
            }

            for (let j = 0; j < 25; j++) {
                ctx3D.beginPath();
                ctx3D.rect((this.rays.length - i - 1) * width, canvas3D.height / 2 - height / 2 + j * height / 25, width, height / 25);
                ctx3D.fillStyle = wall[j % 4][i % 4] ? `rgb(${light * 195}, ${light * 95}, ${light * 64})` : "black";
                ctx3D.fill();
            }
        }
    }

    updateRays() {
        for (let i = -this.fov / this.angleStep / 2; i <= this.fov / this.angleStep / 2; i++) {
            const ray = this.rays[this.fov / this.angleStep / 2 + i];

            ray.x1 = this.x;
            ray.y1 = this.y;
            ray.angle = this.angle + i * this.angleStep * Math.PI / 180;

            const closestPoint = Utilities.closestPoint(ray, obstacles);

            ray.x2 = closestPoint ? closestPoint.point.x : undefined;
            ray.y2 = closestPoint ? closestPoint.point.y : undefined;
        }
    }

    move(straight, sign, angle, funcX, funcY) {
        let rayAngle = this.angle + (straight ? 0 : Math.PI / 2);

        const ray1 = {
            x1: this.x,
            y1: this.y,
            angle: rayAngle
        };

        const ray2 = {
            x1: this.x + sign * 2 * this.speed * funcX(angle),
            y1: this.y - sign * 2 * this.speed * funcY(angle),
            angle: rayAngle
        };

        const oldPoint = Utilities.closestPoint(ray1, obstacles);
        const newPoint = Utilities.closestPoint(ray2, obstacles);

        if (oldPoint && newPoint && oldPoint.obstacle == newPoint.obstacle) {
            this.x = this.x + sign * this.speed * funcX(angle);
            this.y = this.y - sign * this.speed * funcY(angle);
        }
    }
}