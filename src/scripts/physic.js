// Basic functions

function dist2(a,b) { // Square of the distance (faster if we want an non linear interpolation)
	return Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2);
}
function dist(a,b) {  // Distance between two positions
	return Math.sqrt(dist2(a,b));
}
function linearInfluence(a,b) { // For linear interpolation
	var aPos = a.truePosition();
	var bPos = b.truePosition();
	var d = dist(aPos,bPos);
	if(d == 0) return new Pos();
	return new Pos(((aPos.x - bPos.x) / d)*a.load, ((aPos.y - bPos.y) / d)*a.load);
}
function squareInfluence(a,b) {	// For square interpolation
	var aPos = a.truePosition();
	var bPos = b.truePosition();
	var d = dist2(aPos,bPos);
	if(d == 0) return new Pos();
	return new Pos(((aPos.x - bPos.x) / d)*a.load, ((aPos.y - bPos.y) / d)*a.load);
}
function cubeInfluence(a,b) {	// For cube interpolation
	var aPos = a.truePosition();
	var bPos = b.truePosition();
	var d = dist(aPos,bPos);
	d = d*d*d;
	if(d == 0) return new Pos();
	return new Pos(((aPos.x - bPos.x) / d)*a.load, ((aPos.y - bPos.y) / d)*a.load);
}

function coulombInfluence(a,b) {
	var aPos = a.truePosition();
	var bPos = b.truePosition();
	var d = dist(aPos,bPos);
	q = Math.abs(a.load*b.load);
	d = d*d*d;
	if(d == 0) return new Pos();
	graphPoint(d/10,(((aPos.x - bPos.x)*q)/d)*300)
	graphPoint(d/10,(((aPos.y - bPos.y)*q)/d)*300,'lime')
	return new Pos(q*(aPos.x - bPos.x)/d,q*(aPos.y - bPos.y)/d);
}

function uniform(a,b){ // Return uniform random between a and b
	return Math.random()*(b-a)+a;
}

// Classes

class Pos {	// class for stock a 2D position (x,y)
	constructor(x = 0,y = 0) {
		this.x = x;
		this.y = y;
	}
	add(a) {
		if(typeof a == "number"){
			this.x += a;
			this.y += a;
		}
		else{
			this.x += a.x;
			this.y += a.y;
		}
	}
	sub(a) {
		if(typeof a == "number") {
			this.x -= a
			this.y -= a
		}
		else {
			this.x -= a.x;
			this.y -= a.y;
		}
	}
	mult(a) {
		this.x *= a;
		this.y *= a;
		return this;
	}
	debug() {
		return ("x = "+this.x+", y = "+this.y);
	}
}
class Dot {	// QDot for position of electrons
	constructor(x,y) { // get Relative unitary potision (-1 or 1)
		this.x = x*Dot.decal*Qbit.unit;
		this.y = y*Dot.decal*Qbit.unit;
	}
	truePosition() {
		return new Pos(this.x,this.y);
	}
	relativePosition() {
		return new Pos(this.x/Qbit.unit,this.y/Qbit.unit);
	}
	signPosition() {
		return new Pos(this.x/Qbit.unit/Dot.decal,this.y/Qbit.unit/Dot.decal);
	}
}
Dot.decal = 0;

//
//     DOT positions
//   _____________________ x
//  |					  |
//  | -.5 -.5     .5 -.5  |
//  |			  		  |
//  |          *          |
//  |					  |
//  | -.5  .5     .5  .5  |
//  |_____________________|
//  y

class Electron {
	constructor(d, qb, load = 1){
		this.dot = d;
		this.load = load;
		this.influence = new Pos();
		this.nextDot = false;
		this.noise = new Pos();
		this.qb = qb;
		this.setNoise();
		Electron.instances.push(this);
	}
	setNoise(){
		this.noise.x = uniform(-Electron.noiseUniform,Electron.noiseUniform);
		this.noise.y = uniform(-Electron.noiseUniform,Electron.noiseUniform);
	}
	process(qbit) {
		this.setNoise();
		if(!this.fixed) {
			this.influence = this.getInfluence();
			var next = new Pos(this.dot.x,this.dot.y);
			var glPos = this.globalPosition();
			this.nextDot = false;

			if(this.influence.x != 0)
				next.x = this.influence.x/(Math.abs(this.influence.x));
			if(this.influence.y != 0)
				next.y = this.influence.y/(Math.abs(this.influence.y));

			this.nextDot = this.qb.getDotByPos(next);
			if(!this.nextDot)
				this.nextDot = this.dot;
		}
	}
	apply() {
		if(!this.fixed) this.dot = this.nextDot;
	}
	truePosition() { // Postion for calculation
		return new Pos(this.qb.x + this.dot.x + this.noise.x, this.qb.y + this.dot.y + this.noise.y);
	}
	globalPosition() { // Postion with Noise
		return new Pos((this.qb.x + this.dot.x + this.noise.x)/Qbit.unit, (this.qb.y + this.dot.y + this.noise.y)/Qbit.unit);
	}
	graphicPosition() { // Position without Noise
		return new Pos((this.qb.x + this.dot.x)/Qbit.unit, (this.qb.y + this.dot.y)/Qbit.unit);
	}
	getInfluence() {
		var inf = new Pos();
		var posElec = this.truePosition();
		var curInfluence, currentElecPosition,j = 0;
		for(var i of Electron.instances){
			if(i != this){
				currentElecPosition = i.truePosition();
				curInfluence = Electron.processInfluence(this,i);
				inf.add(curInfluence);
			}
			j++;
		}
		return inf;
	}
}
Electron.noiseUniform = 0;
Electron.instances = [];
		
class Qbit {
	constructor(x,y, fixed = false) {
		this.x = x*Qbit.unit;
		this.y = y*Qbit.unit;
		this.electrons = [];
		this.fixed = fixed;
		this.dots = [];
	}
	addDot(d) {
		this.dots.push(d);
		return d;
	}
	addElectron(e) {
		this.electrons.push(e);
		return e;
	}
	process() {
		if(!this.fixed) for(var e of this.electrons) e.process();
	}
	apply() {
		if(!this.fixed) for(var e of this.electrons) e.apply();
	}
	globalPosition() {
		return new Pos(this.x/Qbit.unit,this.y/Qbit.unit);
	}
	getState() {
		var eTop = this.electrons[0];
		var eBot = this.electrons[1];
		if(this.electrons[0].globalPosition().y > this.electrons[1].globalPosition().y)
		{
			eTop = this.electrons[1];
			eBot = this.electrons[0];
		}
		if(eTop.globalPosition().x > eBot.globalPosition().x) return true
		return false
	}
	getDotByPos(pos) { // Return a dot from a position
		var i = 0;
		while(i < this.dots.length){
			if(this.dots[i].signPosition().x == pos.x && this.dots[i].signPosition().y == pos.y)
				return this.dots[i];
			i+=1
		}
		return false;
	}
}
class Family {
	constructor(color="orange") {
		this.qbits = [];
		this.color = color;
	}
	addQbit(q){
		this.qbits.push(q);
		return q;
	}
	process(){
		for(var q of this.qbits)
			q.process();
		for(var q of this.qbits)
			q.apply();
	}
}
class Scene {
	constructor(){
		this.families = [];
	}
	addFamily(f){
		this.families.push(f);
		return f;
	}
	process(){
		for(var f of this.families)
		{
			f.process();
		}
	}
}