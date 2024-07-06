class TileSet {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.tiles = {};
    }

    addTile(id, collideable, color) {
        this.tiles[id] = {
            "collideable": collideable,
            "color": color
        };
    }

    getTile(id) {
        return this.tiles[id];
    }
}

class TileMap {
    constructor(data, tileSet) {
        this.data = data;
        this.tileSet = tileSet;
        this.size = {
            width: data[0].length,
            height: data.length
        };
    }

    /** Return the id of the tile */
    getTile(x, y) {
        return this.data[y][x];
    }

    draw(ctx) {
        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                let tileId = this.getTile(x, y);
                let tileData = this.tileSet.getTile(tileId);
                const tileSize = this.tileSet.tileSize;
                ctx.fillStyle = tileData.color;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

let mapStringData = [
    "################",
    "#              #",
    "#              #",
    "#              #",
    "#              #",
    "#     ####     #",
    "#              #",
    "#          #####",
    "################",
];

let data = mapStringData.map(line => line.split("").map(token => token === "#" ? 1 : 0));

let tileSet = new TileSet(32);
tileSet.addTile(0, false, "white");
tileSet.addTile(1, true, "black");

let tileMap = new TileMap(data, tileSet);

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

document.body.appendChild(canvas);
canvas.width = tileMap.size.width * tileSet.tileSize; 
canvas.height = tileMap.size.height * tileSet.tileSize; 

class Input {
    constructor() {
        this.keys = {
            37: false,
            38: false,
            39: false,
        };
    
        document.addEventListener('keydown', e => this.keys[e.keyCode] = true);
        document.addEventListener('keyup', e => this.keys[e.keyCode] = false);
    }

    isPressed(key) {
        return this.keys[key];
    }
}

let input = new Input();

class KinematicBody {
    constructor(width, height, color, posX, posY) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.gravity = {x: 0, y: 9.8};
        this.position = {x: posX, y: posY};
        this.velocity = {x: 0, y: 0};
        this.speed = 5;
    }
    update() {
        this.velocity.x = (input.isPressed(39) ? this.speed : 0) - (input.isPressed(37) ? this.speed : 0);
        this.move();
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

let player = new KinematicBody(32, 32, "red", 100, 100);

function update() {
    player.update();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    tileMap.draw(ctx);
    player.draw(ctx);
}

function mainLoop() {
    update();
    render();
    requestAnimationFrame(mainLoop);
}

mainLoop();
