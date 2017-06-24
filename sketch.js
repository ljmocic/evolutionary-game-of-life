var population = new Array();
var food = new Array();

var elitism = 5;

var generation = 0;
var populationSize = 30;
var mutationRate = 0.9;
var numberOfFood = 300;
var maxFitness = 0;

var randomFoodGeneration = 30;

var deathEnabled = false;

var mouse;

// start server
// command: python -m http.server
// adress:  http://localhost:8000/
/*
var bg;

function preload() {
    bg = loadImage("map.jpg"); 
}
*/

function setup() {
    createCanvas(883, 550);
    frameRate(30);

    for (var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for (var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(width), random(height)));
    }
}

function draw() {

    // every 10 seconds
    if (frameCount % 150 == 0) {

        var bestInPopulation = new Array();

        // choose best 10 and add to new population       
        for (var i = 0; i < elitism; i++) {

            var maxPopulationFitness = 0;

            var bestChromosome = population[0];
            var bestChromosomeIndex = 0;

            for (var j = 0; j < population.length; j++) {
                population[j].calculateFitness();
                if (population[j].fitness > maxPopulationFitness) {
                    maxPopulationFitness = population[j].fitness;
                    bestChromosome = population[j];
                    bestChromosomeIndex = j;
                }
            }

            population.splice(bestChromosomeIndex, 1);
            bestInPopulation.push(bestChromosome);
        }

        var newPopulation = new Array();
        for (var j = 0; j < elitism; j++) {
            newPopulation.push(bestInPopulation[j]);
        }

        // crossover
        while (newPopulation.length < populationSize) {
            for (var i = 0; i < newPopulation.length / 2; i++) {

                // TODO random number of attributes to be border for crossover
                var child = new Organism();


                child.radius = newPopulation[newPopulation.length - i - 1].radius;
                //child.radius = newPopulation[i].radius;

                child.sight = newPopulation[i].sight;
                //child.sight = newPopulation[i].sight;

                child.maxForce = newPopulation[newPopulation.length - i - 1].maxForce;
                //child.maxForce = newPopulation[i].maxForce;

                //child.maxSpeed = newPopulation[newPopulation.length - i - 1].maxSpeed;
                child.maxSpeed = newPopulation[i].maxSpeed;

                child.randomMutation();

                newPopulation.push(child);
            }
        }

        population.splice(0, population.length);
        population = newPopulation.slice();
        generation++;
        //alert("new population is in the game");
    }

    // update mouse position
    mouse = createVector(mouseX, mouseY);

    // update organisms
    clear();

    // for later image manipulation
    //background(bg);
    background(50);


    for (var i = population.length - 1; i > 0; i--) {
        population[i].update();

        // death   
        if (deathEnabled == true) {
            if (population[i].health <= 0) {
                population.splice(i, 1);
            }
        }
    }

    // random food generation
    if(random(1) < 0.3) {
        for (var i = 0; i < randomFoodGeneration; i++) {
            food.push(createVector(random(width), random(height)));
        }
    }

    // draw food
    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 5);
    }

    refreshParameters();
}

// html controllers
function resetSimulation() {
    population = new Array();
    food = new Array();

    for (var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for (var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(width), random(height)));
    }
}

function refreshParameters() {
    document.getElementById("fitness").innerHTML = "Max fitness: " + maxFitness;
    document.getElementById("population").innerHTML = "Generation: " + generation;

    randomFoodGeneration = document.getElementById("randomFoodGeneration").value;
    document.getElementById("randomFoodGenerationOutput").innerHTML = randomFoodGeneration;

    populationSize = document.getElementById("populationSize").value;
    document.getElementById("populationSizeOutput").innerHTML = populationSize;

    elitism = document.getElementById("elitism").value;
    document.getElementById("elitismOutput").innerHTML = elitism;

    
    mutationRate = document.getElementById("mutationRate").value * 0.01;
    document.getElementById("mutationRateOutput").innerHTML = mutationRate.toFixed(2);;
    
}