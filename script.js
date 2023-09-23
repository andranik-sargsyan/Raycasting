const canvas = document.getElementById("canvas-2d");
const ctx = canvas.getContext("2d");

const player = new Player(canvas.width / 2, canvas.height / 2, 0);
const obstacles = [
    new Obstacle(200, 100, 500, 200),
    new Obstacle(700, 150, 600, 500),
    new Obstacle(400, 150, 700, 560)
];

function update() {
    //TODO: player.updateRays(obstacles);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    for (let obstacle of obstacles) {
        obstacle.draw();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("mousemove", e => {
    player.x = e.offsetX;
    player.y = e.offsetY;
    player.updateRays(obstacles);
});

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "q":
            player.angle += Math.PI / 64;
            break;
        case "e":
            player.angle -= Math.PI / 64;
            break;
        default:
            break;
    }
    player.updateRays(obstacles);
});