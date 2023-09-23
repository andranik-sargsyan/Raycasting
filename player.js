class Player {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.rays = [];
        //TODO: fix angle(s) depending on ray number (start with minus angle)
        this.rays.push(new Ray(x, y, angle));
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

    updateRays(obstacles) {
        for (let ray of this.rays) {
            ray.x1 = this.x;
            ray.y1 = this.y;
            //TODO: fix depending on ray number (relatively)
            ray.angle = this.angle;

            let points = obstacles.map(o => this.collide(ray, o)).filter(p => p);

            if (points.length) {
                let closestPoint = points[0];
                let closestDistance = Math.sqrt((ray.x1 - points[0].x) ** 2 + (ray.y1 - points[0].y) ** 2);
                for (let i = 1; i < points.length; i++) {
                    let point = points[i];
                    let pointDistance = Math.sqrt((ray.x1 - points[i].x) ** 2 + (ray.y1 - points[i].y) ** 2);
                    if (pointDistance < closestDistance) {
                        closestDistance = pointDistance;
                        closestPoint = point;
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

    collide(ray, obstacle) {
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