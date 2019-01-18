class AppController {

    startUpdateLoop() {
        const REFRESH_RATE = 20

        setInterval(() => {
            this.automata.process()
        }, REFRESH_RATE)
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


    /**
     * @brief Singleton constructor
     */
    constructor() {
        if (!AppController.instance) {
            AppController.instance = this
        }

        return AppController.instance
    }
}

const AppControllerInstance = new AppController()
