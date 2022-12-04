class Particle {
    constructor(x, y, x1, y1, myHue, sat, light, decay, weight) {
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.angle = angle;
        this.decay = decay;
        this.myHue = myHue;
        this.sat = sat;
        this.light = light;
        this.weight = weight;
    }

    drawMe() {
  

        push();
        strokeWeight(2* this.weight);
        stroke(this.myHue, this.sat, this.light, this.decay);

        line(this.x, this.y, this.x1, this.y1);
        // fill(255, 255, 255)
        // ellipse(this.x,this.y, 200, 250)
        push();
        scale(1, -1);
        line(this.x, this.y, this.x1, this.y1);
        pop();
        pop();
    }

    removeParticle(myArray) {
        // console.log(random(0,3))
        this.decay -= 0.04;
        if (this.decay < 0) {
            myArray.splice(this, 1);
        }
    }
}
