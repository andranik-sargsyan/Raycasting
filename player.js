class Player {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.rays = [];
        this.speed = 10;
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

            let points = obstacles.map(o => Player.collide(ray, o)).filter(p => p);

            if (points.length) {
                let closestPoint = points[0];
                let closestPointDistance = Math.sqrt((ray.x1 - points[0].x) ** 2 + (ray.y1 - points[0].y) ** 2);
                for (let i = 1; i < points.length; i++) {
                    let distance = Math.sqrt((ray.x1 - points[i].x) ** 2 + (ray.y1 - points[i].y) ** 2);
                    if (distance < closestPointDistance) {
                        closestPoint = points[i];
                        closestPointDistance = distance;
                    }
                }
                ray.x2 = closestPoint.x;
                ray.y2 = closestPoint.y;
            }
            else {
                ray.x2 = undefined;
                ray.y2 = undefined;
            }
        }
    }

    static collide(ray, obstacle) {
        let x1 = obstacle.x1;
        let y1 = obstacle.y1;
        let x2 = obstacle.x2;
        let y2 = obstacle.y2;
        let x3 = ray.x1;
        let y3 = ray.y1;
        let x4 = ray.x1 + Math.cos(ray.angle);
        let y4 = ray.y1 - Math.sin(ray.angle);

        let denominator = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;

        if (t >= 0 && t <= 1 && u >= 0) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }

        return undefined;
    }
}