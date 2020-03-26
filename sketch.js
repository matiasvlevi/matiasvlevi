
let s1;let s2;let s3;let s4;let s5;let s6;

let wnx = 1400;
let wny = 970;

// NeuralNetwork Settings
//let NN;
let lr = 0.05;
let preInput = [];
let preInputDraw;
// NeuralNetwork Graphic Settings
let neuronSize = 10;
let positionX = 700;
let spacingA = 350;
let spacingB = 250;
let yoffsetI;
let yoffsetH;
let yoffsetO;
let yoffsetHs = 1.2;
let yoffsetIs = 1;
let yoffsetOs = 7;
let masterTranslate = -5;
let inputTranslate = 9.5+masterTranslate;
let outputTranslate = 0.8;
let hiddenTranslate = 7.3+masterTranslate;

// GAME
let size = 16;
let estimatedFood = 4;
let pop = 10;
let characters = [];
let time = 0;
let dx; let dy;
let foods = [];
let foodsCount = 100;
let foodSize = 4;
let minimumFood = 0.1;
let worthToReproduce = 3;
let offspringAmount = 6;
let watchedIndex = 0;
let inputCount = (foodsCount*2)+7;
let pxx = 500;
let graphPoints = [];
let averageWorthPoints = [];
let averageWorth = 0;
let mode = 1;
let cycles = 1;
let roundTime = 0;
let spread = 2;
let savedCharacters = [];

function setup() {
    //NN = new NeuralNetwork((foodsCount*2)+5,(foodsCount*2)+5,2);

    let colorC = color(255,255,255);
    for (let i = 0; i < pop; i++) {
        characters.push(new Character(i));
    }





    for (let i = 0; i < foodsCount; i++) {
        foods.push(new Food(random(0,600),random(0,600)));
    }
    for (let i = 0; i < inputCount;i++) {
        preInput.push(0);
    }

    createCanvas(wnx,wny);
    s1 = createSlider(0,89,0);
    s2 = createSlider(1,100,1);
}

function draw() {

    background(51);
    noStroke();
    fill(80);
    rect(0,0,600,600);
    fill(255);
    noStroke();

    watchedIndex = s1.value();
    text("Population: "+ characters.length,5,620);
    text("Current Index: "+ watchedIndex,5,650);
    if (characters.length > 1) {
        text("Current Gen: "+ characters[watchedIndex].gen,5,680);
    }
    cycles = s2.value();

    for (let c = 0; c < cycles;c++) {

        for (let i = 0; i < characters.length; i++) {

            averageWorth += characters[i].worth;

            preInput.splice(0,0,characters[i].pos.x);
            preInput.splice(1,0,characters[i].pos.y);
            preInput.splice(2,0,characters[i].dir.x);
            preInput.splice(3,0,characters[i].dir.y);
            preInput.splice(4,0,1);
            preInput.splice(5,0,characters[i].vel.x);
            preInput.splice(6,0,characters[i].vel.y);


            // if (characters[i].worth > worthToReproduce) {
            //     characters.splice(i,1,new Character(i,characters[i].pos.x,characters[i].pos.y,characters[i].brain,characters[i].gen));
            //
            //     characters.splice(i+characters.length,1,new Character(i+characters.length,characters[i].pos.x + random(-size,size),characters[i].pos.y+random(-size,size),characters[i].brain,characters[i].gen));
            //     characters.splice(i+characters.length,1,new Character(i+characters.length,characters[i].pos.x + random(-size,size),characters[i].pos.y+random(-size,size),characters[i].brain,characters[i].gen));
            //
            //
            // }

            if (characters[i].prey.length > 0) {
                for(let k = 0; k < characters[i].prey.length; k++) {
                    preInput.splice(7+(2*k),0,characters[i].prey[k].pos.x);
                    preInput.splice(8+(2*k),0,characters[i].prey[k].pos.y);

                }
            }

            for (let j = 0; j < foods.length; j++) {
                let state = 0;

                characters[i].check(foods[j]);

                if (foods[j].alive == true) {
                    state = 1;
                } else {
                    state = 0;
                }
                foods[j].render();

                characters[i].hunt(foods[j]);
            }

            dx = characters[i].brain.processOutput(characters[i].brain.processHidden(preInput))[0];
            dy = characters[i].brain.processOutput(characters[i].brain.processHidden(preInput))[1];
            speedD = (int(1000*map(characters[i].brain.processOutput(characters[i].brain.processHidden(preInput))[2],-10000,10000,-1,1)))/200;
            speedDC = constrain(speedD, 0.6, 1.6);
            dirN = createVector(dx,dy);
            dirN.normalize();

            characters[i].update(dirN.x,dirN.y,speedDC);

            if(i == watchedIndex) {
                preInputDraw = preInput;
                colorC = color(255,45,0);
            } else {
                colorC = color(255,255,255);
            }
            characters[i].render(colorC);
            fill(255);
            preInput = [];
            for (let l = 0; l < inputCount;l++) {
                preInput.push(0);
            }

            if(characters[i].pos.x + (characters[i].size/2) >= 600) {
                savedCharacters.push(characters.splice(i, 1)[0]);
            } else if (characters[i].pos.x <= characters[i].size) {
                savedCharacters.push(characters.splice(i, 1)[0]);
            } else if (characters[i].pos.y + (characters[i].size/2) >= 600) {
                savedCharacters.push(characters.splice(i, 1)[0]);
            } else if (characters[i].pos.y <= characters[i].size) {
                savedCharacters.push(characters.splice(i, 1)[0]);
            }



        } ///// main for loop end
    }


    if (roundTime >= 3000 || keyCode === UP_ARROW) {
        for (let i = 0; i < characters.length; i++) {
            savedCharacters.push(characters.splice(i, 1)[0]);
        }
        characters = [];
        roundTime = 0;
    }

    if (characters.length < 1) {
        roundTime = 0;
        nextGeneration(savedCharacters);
        savedCharacters = [];
    }
    let av = map((averageWorth/characters.length),0,8,900,700);
    let py = map(characters.length,0,200,900,700);

    if (graphPoints.length > 1380) {
        graphPoints = [];
    }
    if (averageWorthPoints.length > 1380) {
        averageWorthPoints = [];
    }
    if (time >= 1) {
        graphPoints.push(py);
        averageWorthPoints.push(av);
    }

    beginShape();
    for(let f = 0; f < graphPoints.length;f++) {
        noFill();
        stroke(255);
        //ellipse(30+f,graphPoints[f],2,2);
        vertex(30+f,graphPoints[f]);

        //ellipse(30+f,averageWorthPoints[f],2,2);
    }
    endShape();
    beginShape();
    for(let f = 0; f < averageWorthPoints.length;f++) {
        noFill();
        stroke(255,0,0);
        vertex(30+f,averageWorthPoints[f]);
    }
    endShape(OPEN);
    fill(255);

    stroke(255);
    line(0,900,1380,900);
    line(30,690,30,950);

    line(27,700,33,700);
    line(27,800,33,800);

    line(27,750,33,750);
    line(27,850,33,850);

    noStroke();
    fill(255,100,100);
    text(0,6,900);
    text(6,6,750);
    text(4,6,800);
    text(2,5,850);
    text(8,16,700);
    fill(255);
    text(0,35,900);
    text(100,35,800);
    text(50,35,850);
    text(150,35,750);
    text(200,35,700);
    time++;
    roundTime++;
    //console.log(roundTime);
    averageWorth = 0;


    if (characters.length > 1) {
        characters[watchedIndex].brain.drawNeuralNetwork(preInputDraw);
    }



}

function keyPressed() {

    for (let i = 0; i < characters.length; i++) {
        savedCharacters.push(characters.splice(i, 1)[0]);
    }
        characters = [];

    if (characters.length < 1) {
        roundTime = 0;
        nextGeneration(savedCharacters);
        savedCharacters = [];
    }
}
