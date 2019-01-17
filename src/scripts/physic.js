// Classes

class Qbit {
	constructor(x,y, value = 0,load=1,fixed = false) {
		this.x = x;
		this.y = y;
		this.value = value;
		this.trueValue = value;
		this.nextValue = value;
		this.fixed = fixed;
		this.load = load;
		this.ekij = 0;

		this.visited = false;
	}
	process(s) {
		return this.approximateProcess(s)
		//return this.AVGprocess(s)
	}
	approximateProcess(s) { // QCADesigner approximation method
		if(this.visited) return this.nextValue;
		this.visited = true;
		this.ekij = Qbit.i++;
		if(!this.fixed) {
			var Ekij = this.load; 		// Kink energy between cells 
			var gamma =1;		// Tunneling potential
			var SigmaPj = 0;	// Sum of polarisation of the neighbourgs
			var neighbour = s.getNeighbour(this.x,this.y);
			for(var n of neighbour) {
				//Ekij += ((Math.abs(this.x - n.x) + Math.abs(this.y - n.y))>1?-0.2:1)
				SigmaPj += (n.process(s)*n.load)*((Math.abs(this.x - n.x) + Math.abs(this.y - n.y))>1?-0.2:1);
			}
			var numerator = ((Ekij/(2*gamma)) * SigmaPj);
			this.nextValue = numerator / Math.sqrt(1+Math.pow(numerator,2));
		}
		return this.nextValue;
	}
	AVGprocess(s) { // Simple weighted Average
		if(this.visited) return this.nextValue;
		this.visited = true;
		if(!this.fixed) {
			var avg = 0, curNeighVal = 0;
			var neighbour = s.getNeighbour(this.x,this.y);
			for(var n of neighbour)	avg += (n.process(s)*n.load * ((Math.abs(this.x - n.x) + Math.abs(this.y - n.y))>1?-0.2:1));
			if(neighbour.length == 0) this.nextValue = 0;
			else this.nextValue = avg/neighbour.length;
			return this.nextValue;
		}
		return this.value
	}
	apply() {
		this.visited = false;
		if(!this.fixed)
		{
			this.trueValue = this.nextValue;
			if(this.trueValue == 0) this.value = 0
			else this.value = (this.trueValue<0?-1:1)
		}
	}
	id() {
		return 'x'+this.x+'y'+this.y;
	}
	inverseValue() {
		if(this.fixed) this.value = this.nextValue = this.trueValue = (this.trueValue<0?1:-1);
	}
	getValue() {
		if(this.value == 1) return 1
		return 0
	}
}
Qbit.i = 0;
class Ask extends Qbit {
	constructor(x,y) {
		super(x,y,0,0,false)
		this.askQbit = true;
		this.value = 0
		this.nextValue = 0;
		this.trueValue = 0;
	}
	getValue() {
		if(this.value > 0) return "1"
		if(this.value < 0) return "0"
		return "?"
	}
}

class Family {
	constructor(color="orange") {
		this.qbits = [];
		this.color = color;
	}
	addQbit(q){
		if(this.scene.addQbit(q)) {
			this.qbits.push(q);
			return q;
		}
		return false;
	}
	process(){
		for(var q of this.qbits)
			q.process(this.scene.getNeighbour(q.x,q.y));
	}
	apply() {
		for(var q of this.qbits)
			q.apply();
	}
	getQbitIndex(x,y) {
		var i = 0;
		while(i < this.qbits.length) {
			if(this.qbits[i].x == x && this.qbits[i].y == y) return this.qbits[i]
			i++;
		}
		return false;
	}
	remove(x,y) {
		this.scene.removeQbit(x,y);
		var i = this.getQbitIndex(x,y);
		if(i) this.qbits.slice(i,1);
	}
}

class Scene {
	constructor(){
		this.families = [];
		this.mapQb = [];
		this.ask = false;
	}
	addFamily(f){
		f.scene = this;
		this.families.push(f);
		return f;
	}
	process(){
		Qbit.i = 0;
		this.ask.visited = false;
		if(this.ask) {
			this.ask.process(this);
			this.ask.apply();
			for(var f of this.families) f.apply()
		}
	}
	getQbit(x,y) {
		var q = this.mapQb['x'+x+'y'+y];
		if(q == 'undefined') return false;
		return q
	}
	addQbit(q) {
		if(!this.getQbit(q.x,q.y) && (this.ask.x != q.x || this.ask.y != q.y)){
			this.mapQb[q.id()] = q;
			return true;
		}
		return false;
	}
	removeQbit(x,y) {
		var q = this.getQbit(x,y);
		if(q) delete this.mapQb[q.id()];
	}
	getNeighbour(x,y) {
		var neigh = [],n;
		for(var c of Scene.around) {
			n = this.getQbit(x+c.x,y+c.y);
			if(n) neigh.push(n);
		}
		return neigh;
	}
	setAsk(x,y) {
		if(!this.getQbit(x,y))
		{
			if(this.ask) {
				this.ask.x = x;
				this.ask.y = y;
			}
			else this.ask = new Ask(x,y);
		}
	}
}