var organisms;

var maxSpeed = 1;
var maxForce = 0.5;

var mouse;

function setup() {
    createCanvas(700, 500);
    frameRate(30);
    background(128);

    organisms = new Array();

    for(var i = 0; i < 50; i++) {
        organisms.push(new Organism());
    }
}

function draw() {
    // update mouse position
    mouse = createVector(mouseX, mouseY);

    // update organisms
    clear();
    background(128);
    for(var i = 0; i < organisms.length; i++) {
        organisms[i].update();
    }
}

function Organism() {

    // position
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.desiredPosition = createVector(random(width), random(height));

    // body
    this.radius = 10;
    this.sight = 50;

    // color
    this.colorR = random(255);
    this.colorG = random(255);
    this.colorB = random(255);

    this.move = function() {
        
        // update position
        this.velocity.add(this.acceleration); // add force if there is any
        this.acceleration.mult(0); // reset acceleration
        this.velocity.limit(maxSpeed);
        this.position.add(this.velocity);

        // limit boundaries
        this.position.x = constrain(this.position.x, 0, width - 1);
        this.position.y = constrain(this.position.y, 0, height - 1);
    };

    this.render = function() {

        // body
        fill(this.colorR, this.colorG, this.colorB);
        ellipse(this.position.x, this.position.y, this.radius);

        // sight
        fill(255, 255, 255, 30);
        //console.log(this.desiredPosition);

        var angle = this.velocity.angleBetween(this.desiredPosition);

        document.getElementById("debug").innerHTML = angle;

        arc(this.position.x, 
                this.position.y, 
                this.sight, 
                this.sight, 
                angle - HALF_PI / 2,
                angle + HALF_PI / 2);
        
    };

    this.seek = function(goal) {

        // where should organism go
        var target = p5.Vector.sub(goal, this.position);
        
        // normalize then multiply by maximum speed
        target.setMag(maxSpeed);

        // make it closer to the target
        desiredPosition = p5.Vector.sub(target, this.velocity);
        desiredPosition.limit(maxForce);

        // move towards target, as fast as you can
        this.acceleration.add(desiredPosition);
    };

    this.update = function() {
        this.seek(mouse);
        this.move();
        this.render();
    };
}
