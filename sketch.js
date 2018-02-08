var population = new Array();
var food = new Array();
var water = new Array();
var poison = new Array();
var obstacles = new Array();

var elitism = 5;

var generation = 0;
var populationSize = 30;
var mutationRate = 0.9;
var numberOfFood = 200;
var numberOfWater = 50;
var numberOfPoison = 30;
var numberOfObstacles = 30;
var maxFitness = 0;

var randomFoodGeneration = 15;
var randomWaterGeneration = 3;
var randomPoisonGeneration = 3;

var deathEnabled = false;

var frameWidth = 883;
var frameHeight = 550;

// start server
// command: python -m http.server
// adress:  http://localhost:8000/
/*
var bg;

function preload() {
    bg = loadImage("model/bg1.jpg"); 
}
*/

function setup() {
    createCanvas(frameWidth, frameHeight);
    frameRate(60);

    initElements();
}

function draw() {

    // every 5 seconds generating new population
    if (frameCount % 150 == 0) {
        runGeneticAlgorithm();
    }

    // remove all elements from last frame
    clear();

    // in case of server running, enable background
    //background(bg); 
    background(50);

    removeDead();
    
    generateElements();

    drawElements();
    
    refreshParameters();
}

function initElements() {
    for (var i = 0; i < populationSize; i++) {
        population.push(new Organism());
    }

    for (var i = 0; i < numberOfFood; i++) {
        food.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
    }

    for (var i = 0; i < numberOfWater; i++) {
        water.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
    }

    for (var i = 0; i < numberOfPoison; i++) {
        poison.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
    }
    
    /*
    for (var i = 0; i < numberOfObstacles; i++) {
        obstacles.push(new Obstacle(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10), random(30) + 10, random(30) + 10));
    }
    */
    
}

function drawElements() {
    // draw food
    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 5);
    }

    // water
    for (var i = 0; i < water.length; i++) {
        fill(0, 191, 255);
        noStroke();
        ellipse(water[i].x, water[i].y, 5);
    }

    // poison
    for (var i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 5);
    }

    // obstacles
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].draw();
    }
}

function generateElements() {
    // random food generation
    if (random(1) < 0.3) {
        for (var i = 0; i < randomFoodGeneration; i++) {
            food.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
        }
    }

    // random water generation
    if (random(1) < 0.3) {
        for (var i = 0; i < randomFoodGeneration; i++) {
            if(random(1) < 0.1) {
                water.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
            }
        }
    }

    // random poison generation
    if (random(1) < 0.3) {
        for (var i = 0; i < randomPoisonGeneration; i++) {
            if(random(1) < 0.1) {
                poison.push(createVector(random(frameWidth - 20) + 10, random(frameHeight - 20) + 10));
            }
        }
    }
}

function removeDead() {
    for (var i = population.length - 1; i > 0; i--) {
        population[i].update();

        // death   
        if (deathEnabled == true) {
            if (population[i].health <= 0) {
                population.splice(i, 1);
            }
        }
    }
}

function runGeneticAlgorithm() {
    var bestInPopulation = new Array();

    if(population.length < 10) {
        alert("Population too small! Please reset simulation");
        return;
    }

    // elitism
    var tempElitism = 0;
    if(elitism > population.length) {
        tempElitism = population.length;
    }
    for (var i = 0; i < tempElitism; i++) {

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

        if(child.radius > child.sight) {
            child.sight = child.radius + 5;
        }

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
    water = new Array();
    poison = new Array();
    obstacles = new Array();

    initElements();
}

function refreshParameters() {

    // update info
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
