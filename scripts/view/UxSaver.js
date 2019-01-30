class UxSaver {
    init() {
        this.actions = []
    }
    add(name,params=false) {
    	this.actions.push({n:name,p:params})
    }
    export() {
        let a = document.createElement("a")
        a.href = "data:text/plain;charset=utf-8," + JSON.stringify(this.actions)
        a.download = "UXsave.json"
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    constructor() {
        if (!UxSaver.instance) {
            this.init()
            UxSaver.instance = this
        }
        this.historyAction = false
        return UxSaver.instance
    }
}

const UxSaverInstance = new UxSaver()