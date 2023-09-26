class Utilities {
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

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    }

    static closestPoint(ray, obstacles) {
        const points = obstacles
            .map(o => ({
                point: Utilities.collide(ray, o),
                obstacle: o
            }))
            .filter(p => p.point);

        if (!points.length) {
            return undefined;
        }

        let closestPoint = points[0];
        let closestPointDistance = Utilities.distance(ray.x1, ray.y1, points[0].point.x, points[0].point.y);
        for (let i = 1; i < points.length; i++) {
            const distance = Utilities.distance(ray.x1, ray.y1, points[i].point.x, points[i].point.y);
            if (distance < closestPointDistance) {
                closestPoint = points[i];
                closestPointDistance = distance;
            }
        }

        return closestPoint;
    }
}