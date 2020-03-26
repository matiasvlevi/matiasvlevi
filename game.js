

class Character {
    constructor(i,x,y,brain,parentGen) {

        if (brain) {
            this.pos = createVector(x,y);
            this.size = size;
            this.brain = brain;
            this.gen = parentGen+1

            this.dir = createVector(random(-1*spread,1*spread),random(-1*spread,1*spread));
            this.vel = createVector(random(-1*spread,1*spread),random(-1*spread,1*spread));
            this.speed = 1;
            this.time = 0;
            this.lifeSPan = 1000;
            this.brain.mutate();
        } else {
            // When Starting 1st generation //
            this.gen = 0;

            this.size = size;
            this.dir = createVector(random(-1,1),random(-1,1));
            this.pos = createVector(300,300);
            this.time = 0;
            this.vel = createVector(random(-1,1),random(-1,1));
            this.lifeSPan = 1000
            this.speed = 1;
            this.brain = new NeuralNetwork((estimatedFood*2)+7,int(((estimatedFood*2)+7)*1.15),3);
            this.brain.initiateWeights();
        }
        this.alive = true;
        this.fitness = 0;
        this.index = i;
        this.worth = 0;
        this.perception = 200;
        this.prey = [];

        this.steer = createVector(0,0);


        this.brain.mutate();

    }

    update(dx,dy,sp) {

        this.dir.set(dx,dy);
        this.steer = this.dir.sub(this.vel);
        this.vel.add(this.steer*10);


        this.dir.sub(this.vel);
        this.dir.mult(this.speed*sp);

        this.pos.add(this.dir);

        if (mode == 0) {
            if(this.pos.x + (this.size/2) > 600) {
                this.pos.x = (this.size/2);
            } else if (this.pos.x < 0) {
                this.pos.x = 600-(this.size/2);
            } else if (this.pos.y + (this.size/2) > 600) {
                this.pos.y = (this.size/2);
            } else if (this.pos.y < 0) {
                this.pos.y = 600-(this.size/2);
            }

        }

        if (this.prey.length > 0 && this.prey.length <= 4) {
            for(let i = 0; i < this.prey.length; i++) {
                let prey = this.prey[i];
                this.d = dist(this.pos.x,this.pos.y,prey.pos.x,prey.pos.y);
                if (this.d > (this.size+foodSize)/2) {
                    this.prey.splice(i,1);
                }
            }
        }
    }
    check(other) {
        this.d = dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
        if (this.d < (other.size+this.size)/2 && other.alive == true) {
            other.alive = false;
            this.worth++;
        }

     }
    hunt(food) {
        this.d = dist(this.pos.x,this.pos.y,food.pos.x,food.pos.y);
        if (this.d < this.perception && food != Character && food.alive == true) {
            this.prey.push(food);

        }
    }

    render(c) {
        if (this.alive == true) {
            textSize(10);
            text(this.worth,this.pos.x+(this.size/1.8),this.pos.y-(this.size/1.5));
            noStroke();
            fill(0,255,200,5);
            ellipse(this.pos.x,this.pos.y,this.perception,this.perception);
            fill(c);
            ellipse(this.pos.x,this.pos.y,this.size,this.size);
            stroke(0);
            line(this.pos.x,this.pos.y,this.pos.x+(this.dir.x*(this.size/2)),this.pos.y+(this.dir.y*(this.size/2)));
            stroke(0,255,0);
            //line(this.pos.x,this.pos.y,this.pos.x+(this.vel.x*(this.size/0.5)),this.pos.y+(this.vel.y*(this.size/0.5)));
            noStroke();
        }

    }
}

class Food {
    constructor(x,y) {
        this.pos = createVector(x,y);
        this.size = foodSize;
        this.alive = true;
        this.timer = 0;
    }
    render() {

        if (this.timer >= 1500) {
            this.alive = true;
            this.timer = 0;

        }
        if (this.alive == true) {
            fill(30,255,200);
            ellipse(this.pos.x,this.pos.y,this.size,this.size);
            fill(255);
        } else {
            this.pos.x = random(0,600);
            this.pos.y = random(0,600);

            this.timer++;
        }

    }
}
