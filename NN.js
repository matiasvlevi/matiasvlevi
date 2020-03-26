
function make2DArray(cols,rows) {
    var arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

class NeuralNetwork {
    constructor(lengthI,lengthH, lengthO) {
        this.Aweight;
        this.Bweight;
        this.inputs = [];
        this.inputCount = lengthI;
        this.hidden = [];
        this.hiddenCount = lengthH;
        this.outputs = [];
        this.outputCount = lengthO;
        this.error;

}

//
    initiateWeights() {
        this.Aweight = make2DArray(this.hiddenCount,this.inputCount);
        for (let i = 0; i < this.hiddenCount; i++) {
            for (let j = 0; j < this.inputCount; j++) {
                this.Aweight[i][j] = random(-1,1);
            }
        }
        this.Bweight = make2DArray(this.outputCount,this.hiddenCount);
        for (let i = 0; i < this.outputCount; i++) {
            for (let j = 0; j < this.hiddenCount; j++) {
                this.Bweight[i][j] = random(-1,1);
            }
        }

    }
//
    processHidden(inputs) {

        for(let i = 0; i < this.hiddenCount; i++) {
            this.hidden[i] = 0;
            for (let j = 0; j < this.inputCount; j++) {
                this.hidden[i] = this.hidden[i] + (inputs[j] * this.Aweight[i][j]);

            }

        }
        return this.hidden;
    }
//
    processOutput(hidden) {
        for(let i = 0; i < this.outputCount; i++) {
            this.outputs[i] = 0;
            for (let j = 0; j < this.hiddenCount; j++) {
                this.outputs[i] = this.outputs[i] + (hidden[j] * this.Bweight[i][j]);

            }

        }
        return this.outputs;
    }
//
    mutate() {

        for(let i = 0; i < this.hiddenCount; i++) {
            for (let j = 0; j < this.inputCount; j++) {
                this.Aweight[i][j] = this.Aweight[i][j] +(this.Aweight[i][j]* random(lr,lr*2));

            }

        }
        for(let i = 0; i < this.outputCount; i++) {
            for (let j = 0; j < this.hiddenCount; j++) {
                this.Bweight[i][j] = this.Bweight[i][j] +(this.Bweight[i][j]* random(lr,lr*2));

            }

        }

    }
    drawWeight() {
        for(let i = 0; i < this.hiddenCount; i++) {

            for (let j = 0; j < this.inputCount; j++) {
                text(int(this.Aweight[i][j]*100)/100,(i*20),(j*20)+600);

            }

        }
    }
    drawNeuralNetwork(preInput) {
        yoffsetI = 500/this.inputCount;
        yoffsetH = 500/this.hiddenCount;
        yoffsetO = 500/this.hiddenCount;
        textSize(36);
        text("NeuralNetwork" + " (" + this.inputCount + ", " + this.hiddenCount + ", " + this.outputCount + ")",positionX + spacingB-20,50);
        textSize(10);

        for(let i = 0; i < this.inputCount; i++) {

            stroke((255/this.inputCount)*i,sin(i)*255,255 - (i*this.inputCount));
            for(let j = 0; j < this.hiddenCount; j++) {

                line(positionX,(i+inputTranslate)*(yoffsetI*yoffsetIs),positionX+spacingA,(j+hiddenTranslate)*(yoffsetH*yoffsetHs));
            }
            noStroke();
            textAlign(RIGHT);
            text(round(preInput[i]*100)/100,positionX - 15,(i+inputTranslate)*(yoffsetI*yoffsetIs)+4);
            ellipse(positionX,(i+inputTranslate)*(yoffsetI*yoffsetIs),neuronSize,neuronSize);
        }

        for(let i = 0; i < this.hiddenCount; i++) {

            stroke((255/this.inputCount)*i,sin(i)*255,255 - (i*this.inputCount));
            for(let j = 0; j < this.outputCount; j++) {

                line(positionX+spacingA,(i+hiddenTranslate)*(yoffsetH*yoffsetHs),positionX+(spacingA+spacingB),(j+outputTranslate)*(yoffsetO*yoffsetOs));
            }
            noStroke();
            ellipse(positionX+spacingA,(i+hiddenTranslate)*(yoffsetH*yoffsetHs),neuronSize,neuronSize);
        }
        textSize(18);
        textAlign(LEFT);
        for(let i = 0; i < this.outputCount; i++) {

            let v = createVector(int(this.processOutput(this.processHidden(preInput))[0]),int(this.processOutput(this.processHidden(preInput))[1]));
            v.normalize();
            let va = [int(v.x*1000)/1000,int(v.y*1000)/1000,speedDC];
            ellipse(positionX+(spacingA+spacingB),(i+outputTranslate)*(yoffsetO*yoffsetOs),neuronSize,neuronSize);
            text(va[i],positionX+(spacingA+spacingB)+15,(i+outputTranslate)*(yoffsetO*yoffsetOs+1));

        }
    }
}
