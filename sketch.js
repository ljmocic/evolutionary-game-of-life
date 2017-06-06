var organisms;

function setup() {
    createCanvas(700, 500);
    frameRate(30);
    background(128);

    organisms = new Array();

    for(var i = 0; i < 100; i++) {
        organisms.push(new Chromosome());
    }
}

function draw() {
    clear();
    background(128);
    for(var i = 0; i < organisms.length; i++) {
        organisms[i].move();
        organisms[i].render();
    }
}

function Chromosome() {

    this.radius = 10;
    this.sight = 30;

    // position
    this.x = random(width);
    this.y = random(height);

    // color
    this.colorR = random(255);
    this.colorG = random(255);
    this.colorB = random(255);

    this.move = function() {
        var temp = 3;

        var randomX = floor(random(3));

        if(randomX == 1) {
            this.x += 1;
        }
        if(randomX == 2) {
            this.x -= 1;
        }

        var randomY = floor(random(3));

        if(randomY == 1) {
            this.y += 1;
        }
        else if(randomY == 2) {
            this.y -= 1;
        }

        this.x = constrain(this.x, 0, width - 1);
        this.y = constrain(this.y, 0, height - 1);
    };

    this.render = function() {
        // body
        fill(this.colorR, this.colorG, this.colorB);
        ellipse(this.x, this.y, this.radius);

        // sight
        fill(255, 255, 255, 30);
        arc(this.x, this.y, 50, 50, 0, HALF_PI);
    };
}
