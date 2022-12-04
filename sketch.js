/*
Kaleidoscope adopted from https://p5js.org/examples/interaction-kaleidoscope.html
*/

let clr;
let socket;

let particles;
let newRow;


let symmetry = 6;
let step = 50;
let angle = 360 / symmetry;
var textfield;
let names = [];
let table;

let myHue = 0;
let mySaturation = 100;
let myLight = 100;
let myStrokeWeight;
let life = 0.05;



let myHue2 = 0;
let mySaturation2 = 100;
let myLight2= 100;
let myStrokeWeight2 ;
let life2 = 0.05;

let dx;
let dy;
let dx1
let dy1
let dlife;



let rotAngle = 0;
let clearButton;
let sizeSlider;
let hSlider;

let xOff;
let yOff;

let inc = 0.2;

let vol = 0.0;
let mic;
let pitch;
let audioContext;
let model_url =
	"https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let noteScale = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];
let currentNote = "";

let colors = [];
let art;

function setup() {
    
	particles = [];
	addColumns();
	enableAudio();
	canvasSetup();
	defineColorPalette();
	angleMode(DEGREES);
	createDiv();

    colorPicker = createColorPicker('#0f082a');
    colorPicker.position(width/100, height/1.2);
    colorPicker.style('background-color',"black")
    colorPicker.style('border-color',"black")
    colorPicker.style('width',"50px")
    colorPicker.style('height',"50px")
    // colorPicker.style('border-radius',"10px")    

	xOff = random(10);
	yOff = random(10);
	textAlign(CENTER);

}

function displayDot(x, y, color, color2 = 100) {
	colorMode(HSB);
	fill(color, 100, color2);
	ellipse(x, y, 200);
	// colorMode(RGB);
}

function draw() {
	// Uncomment to see the particles disappear

	myHue = hue(colorPicker.color())
	// myHue2 = hSlider.value();

	background(0);
	// if (vol > 0.1) {
	// 	symmetry += 0.01;
	// }
	// else {
	// 	if (symmetry > 6) {
	// 		symmetry -= 0.008;
	// 	}
	// }


	// symmetry+=0.0001;
	angle = 360 / symmetry;        //PLAY WITH SETTING / PARAMETERS THIS WAY TOO
	translate(windowWidth / 2, windowHeight / 2)
	// scale(0.3,0.3)
	for (let i = 0; i < particles.length; i++) {
		for (let j = 0; j < symmetry; j++) {
			rotate(angle);
			particles[i].drawMe(mySaturation);
		}
        particles[i].removeParticle(particles);
		
	}

    console.log(vol*0.04)

	vol = noise(1)

	xOff += constrain(vol / 5, 0, 0.004);
	yOff += constrain(vol / 5, 0, 0.004);


	let mx = noise(xOff) * width - width / 2;
	let my = noise(yOff) * height - height / 2;

	let pmx = noise(xOff - inc) * width - width / 2;
	let pmy = noise(yOff - inc) * height - height / 2; //xoff and y off control the randomness of it
	myStrokeWeight = vol ;
	// life = 0.05;
	// life2 = 0.05;

	// if (vol > 0.05) {
	// 	life = 1
	// 	life2 = 1
	// 	console.log("working");
	// }

	//need to record the hslider value because its specific to its instance



	push();

	particles.push(new Particle(mx, my, pmx, pmy, myHue, mySaturation, myLight, 1, myStrokeWeight))
	// scale(0.9, 0.9)


	clr = upgradeColor(clr);


	// scale(0.9, 0.9)

	// particle.drawMe();
	// console.log(data)
	// console.log("sending:", vol * w + ",", vol * h + ",", clr);
	// noStroke();
	// displayDot(vol * w, vol * h, clr);
}


function upgradeColor(c) {
	if (c < 0) {
		c = 360 - c;
	} else if (c > 360) {
		c = c % 360;
	}
	return c;
}

function touchStarted() {
	getAudioContext().resume();
}

function addColumns() {

	table = new p5.Table();

	table.addColumn('mx');
	table.addColumn('my');
	table.addColumn('pmx');
	table.addColumn('pmy');
	table.addColumn('hue');
	table.addColumn('saturation');
	table.addColumn('lightness');
	table.addColumn('life');
	table.addColumn("strokeWeight");
	table.addColumn('mx2');
	table.addColumn('my2');
	table.addColumn('pmx2');
	table.addColumn('pmy2');
	table.addColumn('hue2');
	table.addColumn('saturation2');
	table.addColumn('lightness2');
	table.addColumn('life2');
	table.addColumn("strokeWeight2");
}



function enableAudio() {
	// audioContext = getAudioContext();
	// getAudioContext().resume();
	// mic = new p5.AudioIn();
	// mic.start();
}


function canvasSetup() {

	canvas = createCanvas(windowWidth-10, windowHeight-10);
    canvas.position(0,0 );
    canvas.style("z-index",-1);
	background(0);
	clr = random(360);
	noStroke();
	colorMode(HSB);
}

function defineColorPalette() {
	for (let i = 0; i < noteScale.length; i++) {
		let newColor = color(i * 360 / noteScale.length, 50, 100, 0.8);
		let satValue = 100 / noteScale.length * i; //minues 100 to reverse
		colors.push(satValue);
		// colors.push(newColor);
	}
}

function createFile() {
	let randomName = random(100, 1000000)
	saveTable(table, int(randomName) + '.csv');
}


function startPitch() {
	pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

//Load the model and get the pitch
function modelLoaded() {
	select('#status').html
	getPitch(startPitch);
}

function getPitch() {
	pitch.getPitch(function (err, frequency) {
		if (frequency) {
			let midiNum = freqToMidi(frequency);
			currentNote = noteScale[midiNum % 12];
			// stroke(colors[midiNum % 12]);
			if (step > colors[midiNum % 12]) {
				step -= 0.5;
			}
			else step += 0.5;
			mySaturation = step;
			select('#noteAndVolume').html;
		}
		getPitch();
	})
}

function reset() {
	background(0);
	particles.splice(0, particles.length)
}

