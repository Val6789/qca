/*
    global
    Dot
    Electron
    Qubit
    InputBlock
    Editor
    QuantumAutomata
*/
/*
    exported
    AppControllerInstance
*/


class AppController {

    startUpdateLoop() {
        clearInterval(this.interval)
        if (this._refreshRate > 0) {
            this.interval = setInterval(() => {
                this.automata.process()
                Qubit.updateAllQubitDetermination()
            }, this._refreshRate)
        }
    }

    get view() {
        return this.currentView
    }

    get refreshRate() {
        return this._refreshRate
    }

    set refreshRate(rate) {
        if (this._refreshRate === rate) return
        this._refreshRate = rate
        this.startUpdateLoop()
    }

    _onAssetLoading() {
        this.currentView = new ThreeViewController()
        this.currentView.setModeIntro()
            .then(() => {
                // DESTROY THE OLD VIEW
                this.currentView._destructor()

                // Create the new
                this.automata = new QuantumAutomata()
                this.refreshRate = AppController.SPEED
                this.startUpdateLoop()
                this.currentView = new ThreeViewController()
                this.currentView.setModeSandbox()
            })

        AchievementManager.Get()
        MissionManager.Get()

        DrawerControllerInstance.init()
    }

    init() {
        return new Promise(resolve => {
            AssetManager.Create().then(() => {
                this._onAssetLoading()
                this.automata = new QuantumAutomata()
                resolve()
            })
        })
    }

    ready() {
        this.isReady = true
        this.show()
        console.log("ready for action.")
    }

    show() {
        var overlay = document.getElementById("loading-overlay")
        overlay.parentElement.removeChild(overlay)
    }


    /**
     * @brief Singleton constructor
     */
    constructor() {
        if (!AppController.instance) {
            AppController.instance = this
        }
        this.refreshRate = AppController.SPEED
        this.pauseMode = false
        this.currentView
        return AppController.instance
    }
}

const AppControllerInstance = new AppController()

AppController.PAUSE = 0
AppController.SPEED = 75
AppController.SPEED_SLOW = 150
AppController.SPEED_FAST = 1
