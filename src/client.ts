var ctx = new AudioContext();

var semitoneRatio = Math.pow(2, 1/12);
var notes = [220];
while(notes.length <= 8 * 12) {
	notes.push(notes[notes.length-1] * semitoneRatio);
}
while(notes.length <= 12 * 12 + 5) {
	notes.unshift(notes[0] / semitoneRatio);
}

var base = 16;
function generateScale(middle:number) {
	var octaves = 6;
	var offsets = [middle, 7];
	var keys = [];
	for (var octave = 0; octave < octaves; octave++) {
		keys.push(octave * 12);
		for(var iOffset = 0; iOffset < offsets.length; iOffset++) {
			keys.push(octave * 12 + offsets[iOffset]);
		}
	}
	return keys;
}
var minor = generateScale(3);
var major = generateScale(4);

var scales = [
	major,
	major,
	minor,
	minor,
	major,
	major,
	major,
	major,
	major,
	minor,
	minor,
	major,
	major,
	//
	major,
	major,
	minor,
	minor,
	major,
	major,
	major,
	major,
	major,
	minor,
	minor,
	major,
	major,
];

var remap = [
	0,
	2,
	4,
	5,
	7,
	9,
	11,
	12,
	14,
	16,
	17,
	19
];

var delay = ctx.createDynamicsCompressor();
delay.connect(ctx.destination);
const needInteraction:Array<()=>void> = []
var waves = minor.map(function(value, index) {
	value += base;
	var wave = ctx.createOscillator();
	var gain = ctx.createGain();

	wave.connect(gain);
	wave.frequency.value = notes[value] + (Math.random() * 200);
	gain.connect(delay);
	gain.gain.value = 0.025;
	console.log(index)
	needInteraction.push(wave.start.bind(wave));
	return wave;
});

var mutate = 0;
setInterval(function() {
	// mutate = ~~(Math.random() * 12);
	mutate = (mutate + 1) % 12;
	// var key = remap[mutate];
	// var scale = scales[key];
	waves.forEach(function(wave, i) {
		wave.frequency.value -= (Math.random() +0.5) * 2//notes[scale[i]+base+key] + (Math.random() * 200);
		if(wave.frequency.value < 20) {
			wave.frequency.value *= 32
		}
	});
}, 100);

let started = false
document.onclick = ev => {
	if(!started) {
		started = true
		needInteraction.forEach(cb => cb())
	}
}