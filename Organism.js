function Organism() {

    this.fitness = 0;

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

    this.calculateFitness = function () {
        var score = 0;

        //score += Math.abs(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        score += this.maxForce;
        score += this.maxSpeed;
        
        score += this.radius;
        score += this.sight;

        if (score > maxFitness) {
            maxFitness = score;
        }

        this.fitness = score;
    };

    this.randomMutation = function () {

        var randomNumber = Math.floor(random(6));

        if (randomNumber < 1) {
            if (random(1) < 0.5) {
                this.position.add(this.position * random(1));
            }
            else {
                this.position.add(this.position * random(1) * (-1));
            }
        }
        else if (randomNumber < 2) {
            if (random(1) < 0.5) {
                this.radius = this.radius * 1.3;
            }
            else {
                this.radius = this.radius * 0.7;
            }
        }
        else if (randomNumber < 4) {
            if (random(1) < 0.5) {
                this.maxForce = this.maxForce * 1.3;
            }
            else {
                this.maxForce = this.maxForce * 0.7;
            }
        }
        else if (randomNumber < 5) {
            if (random(1) < 0.5) {
                this.maxSpeed = this.maxSpeed * 1.3;
            }
            else {
                this.maxSpeed = this.maxSpeed * 0.7;
            }
        }

    };

    this.eat = function () {

        var minDistance = Infinity;
        var minIndex = -1;

        for (var i = 0; i < food.length; i++) {

            var distance = int(dist(this.position.x, this.position.y, food[i].x, food[i].y));

            if (distance < minDistance) {
                minDistance = distance;
                minIndex = i;
            }

        }

        if (minDistance < 5) {
            food.splice(minIndex, 1);
            this.health += 50;
        }

    };

    this.seek = function () {

        //var goal = mouse; // if you want to follow mouse
        // document.getElementById("debug").innerHTML = random(50) - 25;

        var minDistance = Infinity;
        var minIndex = -1;

        var goal;
        var desire;
        var target;

        // if it sees food, it should follow it
        for (var i = 0; i < food.length; i++) {

            var distance = int(dist(this.position.x, this.position.y, food[i].x, food[i].y));

            if (distance < minDistance) {
                minDistance = distance;
                minIndex = i;
            }

        }

        if (minDistance < this.sight) {
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
        else if (frameCount % floor(random(30)) == 0) {
            var randomMovement = 7;
            var randX = this.velocity.x + random(randomMovement) - randomMovement / 2;
            var randY = this.velocity.y + random(randomMovement) - randomMovement / 2;
            this.acceleration = createVector(randX, randY);
        }
    };

    this.move = function () {

        // update position
        this.velocity.add(this.acceleration); // add force if there is any
        this.acceleration.mult(0); // reset acceleration
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        // let wall be a portal to the other side
        if (this.position.x < 5) {
            this.position.x = width - 5;
        }
        if (width - this.position.x < 5) {
            this.position.x = 5;
        }
        if (this.position.y < 5) {
            this.position.y = height - 5;
        }
        if (height - this.position.y < 5) {
            this.position.y = 5;
        }

        // limit boundaries classic way
        // this.position.x = constrain(this.position.x, 0, width - 1);
        // this.position.y = constrain(this.position.y, 0, height - 1);
    };

    this.render = function () {

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
        arc(0, 0, this.sight, this.sight, PI + PI / 4, PI + 3 * PI / 4);
        endShape(CLOSE);
        pop();

    };

    this.update = function () {
        this.calculateFitness();
        this.eat();
        this.seek();
        this.move();
        this.render();
        this.health -= 10;
    };
}