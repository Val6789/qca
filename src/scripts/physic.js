/*
    exported
    Qbit
    Ask
    Scene
*/
// Classes

class Qbit {
    constructor(x, y, value = 0, load = 1, fixed = false) {
        this.x = x
        this.y = y
        this.value = value
        this.nextValue = value
        this.fixed = fixed
        this.load = load

        this.visited = false
    }
    process(s) { // QCADesigner approximation method
        if (this.visited) return this.nextValue
        this.visited = true
        if (!this.fixed) {
            var Ekij = 1 // Kink energy between cells 
            var gamma = 1 // Tunneling potential
            var SigmaPj = 0 // Sum of polarisation of the neighbourgs
            var neighbour = s.getNeighbour(this.x, this.y)
            for (var n of neighbour) {
                SigmaPj += (n.process(s) * n.load) * ((Math.abs(this.x - n.x) + Math.abs(this.y - n.y)) > 1 ? -0.2 : 1)
            }
            var numerator = ((Ekij / (2 * gamma)) * SigmaPj)
            this.nextValue = numerator / Math.sqrt(1 + Math.pow(numerator, 2))
        }
        return this.nextValue
    }
    apply() {
        this.visited = false
        if (!this.fixed) {
            if (this.nextValue == 0) this.value = 0
            else this.value = (this.nextValue < 0 ? -1 : 1)
        }
    }
    id() {
        return "x" + this.x + "y" + this.y
    }
    inverseValue() {
        if (this.fixed) this.value = this.nextValue = (this.value < 0 ? 1 : -1)
    }
    getValue() {
        if (this.value == 1) return 1
        return 0
    }
}
class Ask extends Qbit {
    constructor(x, y) {
        super(x, y, 0, 0, false)
        this.askQbit = true
        this.value = 0
        this.nextValue = 0
    }
    getValue() {
        if (this.value > 0) return "1"
        if (this.value < 0) return "0"
        return "?"
    }
}

class Scene {
    constructor() {
        this.qbits = []
        this.mapQb = []
        this.ask = false
    }
    process() {
        if (this.ask) {
            this.ask.visited = false
            this.ask.process(this)
            this.ask.apply()
            for (var q of this.qbits) q.apply()
        }
    }
    getQbit(x, y) {
        var q = this.mapQb["x" + x + "y" + y]
        if (q == "undefined") return false
        return q
    }
    addQbit(q) {
        if (!this.getQbit(q.x, q.y) && (this.ask.x != q.x || this.ask.y != q.y)) {
            this.mapQb[q.id()] = q
            this.qbits.push(q)
            return true
        }
        return false
    }
    removeQbit(x, y) {
        var q = this.getQbit(x, y)
        if (q) delete this.mapQb[q.id()]
    }
    getNeighbour(x, y) {
        var neigh = [],
            n
        for (var c of Scene.around) {
            n = this.getQbit(x + c.x, y + c.y)
            if (n) neigh.push(n)
        }
        return neigh
    }
    setAsk(x, y) {
        if (!this.getQbit(x, y)) {
            if (this.ask) {
                this.ask.x = x
                this.ask.y = y
            } else this.ask = new Ask(x, y)
        }
    }
}