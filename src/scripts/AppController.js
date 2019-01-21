class AppController {

    startUpdateLoop() {
       this.interval = setInterval(() => {
            if(!this.pauseMode) this.automata.process()
        }, this.refreshRate)
    }

    _onAssetLoading() {
        ThreeViewControllerInstance.init()
        Dot.init()
        Electron.init()
        InputBlock.init()
        Qubit.startDeterminationUpdateLoop()
        new QubitEditor()
        AchievementManager.Get().obtained("missionOne")
        ToolboxControllerInstance.init()
        QubitEditorInstance.init()
    }

    init() {
        return new Promise( resolve => {
            AssetManager.Create().then(() => {
                this._onAssetLoading()
                this.automata = new QuantumAutomata()
                resolve()
            })
        })
    }

    setRefreshRate(rate) {
        this.refreshRate = rate
        clearInterval(this.interval)
        startUpdateLoop()
    }

    setPause() {
        this.pauseMode = this.pauseMode?false:true;
    }

    ready() {
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
        this.refreshRate = 20
        this.pauseMode = false
        return AppController.instance
    }
}

const AppControllerInstance = new AppController()
