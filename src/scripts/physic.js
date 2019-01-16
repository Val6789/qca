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

		this.visited = false;
	}
	/*process(neighbour) { // QCADesigner method
		if(!this.fixed) {
			var Ekij = this.load;
			var gamma =1;
			var SigmaPj = 0;
			for(var n of neighbour) SigmaPj += (n.value*n.load * ((Math.abs(this.x - n.x) + Math.abs(this.y - n.y))>1?-1:1));
			var numerator = ((Ekij/(2*gamma)) * SigmaPj);
			this.nextValue = numerator / Math.sqrt(1+Math.pow(numerator,2));
		}
	}*/
	process(s) { // Simple weighted Average
		if(this.visited) return this.nextValue;
		this.visited = true;
		if(!this.fixed) {
			var avg = 0;
			var neighbour = s.getNeighbour(this.x,this.y);
			for(var n of neighbour) {
				avg += (n.process(s)*n.load * ((Math.abs(this.x - n.x) + Math.abs(this.y - n.y))>1?-0.2:1));
			}
			this.nextValue = avg/neighbour.length;
			return this.nextValue;
		}
		return this.value
	}
	apply() {
		this.visited = false;
		if(!this.fixed)
		{
			this.trueValue = this.nextValue;
			this.value = (this.trueValue<0?-1:1)
		}
	}
	id() {
		return 'x'+this.x+'y'+this.y;
	}
	inverseValue() {
		if(this.fixed) this.value = this.trueValue = (this.trueValue<0?1:-1);
	}
	getValue() {
		if(this.value == 1) return 1
		return 0
	}
}

class Ask extends Qbit {
	constructor(x,y) {
		super(x,y,0,0,false)
		this.askQbit = true;
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
		this.ask.visited = false;
		if(this.ask) this.ask.process(this);
		for(var f of this.families) f.apply()
	}
	getQbit(x,y) {
		var q = this.mapQb['x'+x+'y'+y];
		if(q == 'undefined') return false;
		return q
	}
	addQbit(q) {
		if(!this.getQbit(q.x,q.y)){
			this.mapQb[q.id()] = q;
			return true;
		}
		return false;
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
		if(this.ask) {
			this.ask.x = x;
			this.ask.y = y;
		}
		else this.ask = new Ask(x,y);
	}
}