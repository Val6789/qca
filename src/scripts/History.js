class HistoryClass {
	init() {
		this.back = [];
		this.front = [];
	}
	static undo() {
		let lastAction = this.back.pop()
		HistoryClass._applyAction(lastAction)
		this.front.push(lastAction)
		
	}
	static redo() {
		let lastAction = this.front.pop()
		HistoryClass._applyAction(lastAction)
		this.back.push(lastAction)
	}
	static _applyAction(action) {
		// do the action
	}
	static add(action,position) {
		this.back.push({action:action,position:position)
	}
	constructor() {
        if (!HistoryClass.instance) {
        	this.init()
            HistoryClass.instance = this
        }

        return HistoryClass.instance
	}
}
const History = new HistoryClass()