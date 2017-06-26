var population = new Array();
var food = new Array();
var water = new Array();

var elitism = 5;

var generation = 0;
var populationSize = 30;
var mutationRate = 0.9;
var numberOfFood = 200;
var numberOfWater = 50;
var maxFitness = 0;

var randomFoodGeneration = 15;
var randomWaterGeneration = 3;

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

var frameWidth = 883;
var frameHeight = 550;

function setup() {
    createCanvas(frameWidth, frameHeight);
    frameRate(30);

    for (var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for (var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
    }

    /*
    for (var i = 0; i < numberOfWater; i++) {
        water.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
    }
    */
}

function draw() {

    // every 10 seconds
    if (frameCount % 150 == 0) {
        runGeneticAlgoritm();
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
    if (random(1) < 0.3) {
        for (var i = 0; i < randomFoodGeneration; i++) {
            food.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
        }
    }

    /*
    if (random(1) < 0.3) {
        for (var i = 0; i < randomWaterGeneration; i++) {
            water.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
        }
    }
    */

    // draw food
    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 5);
    }

    /*
    for (var i = 0; i < water.length; i++) {
        fill(0, 191, 255);
        noStroke();
        ellipse(water[i].x, water[i].y, 5);
    }
    */

    refreshParameters();
}

function runGeneticAlgoritm() {
    var bestInPopulation = new Array();

    // elitism     
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

        var parent1 = population[Math.floor(random(population.length))];
        var parent2 = population[Math.floor(random(population.length))];
        var child = new Organism();

        if (random(1) < 0.5) {
            child.radius = parent1.radius;
        }
        else {
            child.radius = parent2.radius;
        }

        if (random(1) < 0.5) {
            child.sight = parent1.sight;
        }
        else {
            child.sight = parent2.sight;
        }

        if (random(1) < 0.5) {
            child.maxForce = parent1.maxForce;
        }
        else {
            child.maxForce = parent2.maxForce;
        }

        if (random(1) < 0.5) {
            child.maxSpeed = parent1.maxSpeed;
        }
        else {
            child.maxSpeed = parent2.maxSpeed;
        }

        // mutation
        child.randomMutation();

        newPopulation.push(child);
    }

    population.splice(0, population.length);
    population = newPopulation.slice();
    generation++;
    //alert("new population is in the game");
}

// html controllers
function resetSimulation() {
    population = new Array();
    food = new Array();

    for (var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for (var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
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
    document.getElementById("mutationRateOutput").innerHTML = mutationRate.toFixed(2);

    deathEnabled = document.getElementById("deathCheckbox").checked;
}