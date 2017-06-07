var population;
var populationSize = 10;

var food;
var numberOfFood = 100;

var maxFitness = 0;

var mouse;

function setup() {
    createCanvas(800, 600);
    frameRate(30);
    background(128);

    population = new Array();
    food = new Array();

    for(var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for(var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(width), random(height)));
    }
}

function draw() {
    // update mouse position
    mouse = createVector(mouseX, mouseY);

    // update organisms
    clear();
    background(128);
    for(var i = population.length - 1; i >= 0; i--) {
        population[i].update();
        if(population[i].health <= 0) {
            population.splice(i, 1);
        }
    }

    // draw food
    for(var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 5);
    }

    document.getElementById("debug").innerHTML = "Max fitness: " + maxFitness;
}

function Organism() {

    // position
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(this.maxSpeed), random(this.maxSpeed));
    this.acceleration = createVector(0, 0);
    this.desiredPosition = createVector(random(width), random(height));
    this.maxForce = random(1);
    this.maxSpeed = random(10);

    // health
    this.health = 100;

    // body
    this.radius = 10;
    this.sight = random(30, 70);

    // color
    this.colorR = random(255);
    this.colorG = random(255);
    this.colorB = random(255);

    this.fitness = function() {
        var score = 0;

        score += Math.abs(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        score += this.maxForce;
        score += this.maxSpeed;
        score += this.health;

        if(score > maxFitness) {
            maxFitness = score;
        }
    };

    this.eat = function() {

        var minDistance = Infinity;
        var minIndex = -1;

        for(var i = 0; i < food.length; i++) {

            var distance = int(dist(this.position.x, this.position.y, food[i].x, food[i].y));

            if(distance < minDistance) {
                minDistance = distance;
                minIndex = i;
            }

        }

        if(minDistance < 5 ) {
            food.splice(minIndex, 1);
            this.health += 50;
        }
        
    };

    this.seek = function() {

        //var goal = mouse; // if you want to follow mouse
        // document.getElementById("debug").innerHTML = random(50) - 25;

        var minDistance = Infinity;
        var minIndex = -1;

        var goal;
        var desire;
        var target;

        // if it sees food, it should follow it
        for(var i = 0; i < food.length; i++) {

            var distance = int(dist(this.position.x, this.position.y, food[i].x, food[i].y));

            if(distance < minDistance) {
                minDistance = distance;
                minIndex = i;
            }

        }

        if(minDistance < this.sight - 30 ) {
            goal = food[minIndex];

            // want to eat food so bad
            desire = 1;

            target = p5.Vector.sub(goal, this.position);
        
            // normalize then multiply by maximum speed
            target.setMag(this.maxSpeed * desire);

            // make it closer to the target
            this.desiredPosition = p5.Vector.sub(target, this.velocity);
            this.desiredPosition.limit(this.maxForce);

            // move towards target, as fast as you can
            this.acceleration.add(this.desiredPosition);
        }
        // randomize moving
        else if(frameCount % floor(random(30)) == 0) {
            var randomMovement = 7;
            var randX = this.velocity.x + random(randomMovement) - randomMovement / 2;
            var randY = this.velocity.y + random(randomMovement) - randomMovement / 2;
            this.acceleration = createVector(randX, randY);
        }
    };

    this.move = function() {
        
        // update position
        this.velocity.add(this.acceleration); // add force if there is any
        this.acceleration.mult(0); // reset acceleration
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        // let wall be a portal to the other side
        if(this.position.x < 5) {
            this.position.x = width - 5;
        }
        if(width - this.position.x < 5) {
            this.position.x = 5;
        }
        if(this.position.y < 5) {
            this.position.y = height - 5;
        }
        if(height - this.position.y < 5) {
            this.position.y = 5;
        }

        // limit boundaries classic way
        // this.position.x = constrain(this.position.x, 0, width - 1);
        // this.position.y = constrain(this.position.y, 0, height - 1);
    };

    this.render = function() {

        var theta = this.velocity.heading() + PI / 2;
        push();
        // act like it is in the left upper corner
        translate(this.position.x, this.position.y);
        rotate(theta);

        // draw an organism
        fill(this.colorR, this.colorG, this.colorB);
        stroke(this.colorG);
        beginShape(this.colorB);
        ellipse(0, 0, this.radius);

        // draw sensor
        fill(255, 255, 255, 30);
        stroke(0, 255, 0);
        arc(0, 0, this.sight, this.sight,  PI + PI / 4, PI + 3 * PI / 4);
        endShape(CLOSE);
        pop();
        
    };

    this.update = function() {
        this.fitness();
        this.eat();
        this.seek();
        this.move();
        this.render();
        this.health -= 1;
    };
}
