const canvas = document.getElementById("canvas-2d");
const ctx = canvas.getContext("2d");

const canvas3D = document.getElementById("canvas-3d");
const ctx3D = canvas3D.getContext("2d");

const gun = document.getElementById("gun");
gun.style.left = `${canvas3D.offsetLeft + canvas3D.width / 2 - gun.width / 2}px`;
gun.style.top = `${canvas3D.offsetTop + canvas3D.height - gun.height}px`;

const player = new Player(canvas.width / 2, canvas.height / 2, Math.PI);
const obstacles = [
    //walls
    new Obstacle(0, 0, canvas.width, 0),
    new Obstacle(0, canvas.height, canvas.width, canvas.height),
    new Obstacle(0, 0, 0, canvas.height),
    new Obstacle(canvas.width, 0, canvas.width, canvas.height),

    //square
    new Obstacle(50, 450, 100, 450),
    new Obstacle(50, 500, 100, 500),
    new Obstacle(50, 450, 50, 500),
    new Obstacle(100, 450, 100, 500),

    //triangle
    new Obstacle(150, 200, 180, 260),
    new Obstacle(150, 200, 110, 270),
    new Obstacle(110, 270, 180, 260),

    //square
    new Obstacle(550, 150, 650, 170),
    new Obstacle(650, 170, 650, 440),
    new Obstacle(650, 440, 550, 260),
    new Obstacle(550, 260, 550, 150)
];

player.updateRays();

function update() {
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx3D.clearRect(0, 0, canvas3D.width, canvas3D.height);
    player.draw();
    player.draw3D();
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
    player.updateRays();
});

canvas.addEventListener("wheel", e => {
    player.angle += e.deltaY / 100 * Math.PI / 64;
    canvas3D.style.backgroundPositionX = `${player.angle * 720}px`;
    player.updateRays();
});

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "w":
            player.x += player.speed * Math.cos(player.angle);
            player.y -= player.speed * Math.sin(player.angle);
            break;
        case "s":
            player.x -= player.speed * Math.cos(player.angle);
            player.y += player.speed * Math.sin(player.angle);
            break;
        case "a":
            player.angle += Math.PI / 64;
            canvas3D.style.backgroundPositionX = `${player.angle * 720}px`;
            break;
        case "d":
            player.angle -= Math.PI / 64;
            canvas3D.style.backgroundPositionX = `${player.angle * 720}px`;
            break;
        case "q":
            player.x -= player.speed * Math.sin(Math.PI - player.angle);
            player.y += player.speed * Math.cos(Math.PI - player.angle);
            break;
        case "e":
            player.x += player.speed * Math.sin(Math.PI - player.angle);
            player.y -= player.speed * Math.cos(Math.PI - player.angle);
            break;
        case " ":
            gun.src = "gun-shot.gif";
            setTimeout(() => {
                gun.src = "gun.png";
            }, 750);
            break;
        default:
            break;
    }
    player.updateRays();
});