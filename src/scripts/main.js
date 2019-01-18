/* 
    global 
    ThreeViewControllerInstance,
    Qubit,
    Dot,
    Electron,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditor,
    QubitEditorInstance,
*/
/* 
    global 
    ThreeViewControllerInstance,
    Qubit,
    Dot,
    Electron,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditor,
    QubitEditorInstance,
    QuantumAutomata,
*/

class AppController {

    loadNewAutomata() {
        this.automata = new QuantumAutomata()
    }


    startUpdateLoop() {
        const REFRESH_RATE = 20

        setTimeout(() => {
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

    _init() {
        AssetManager.Create().then(() => {
            this._onAssetLoading()
            this.loadNewAutomata()
        })
    }


    /**
     * @brief Singleton constructor
     */
    constructor() {
        if (!AppController.instance) {
            this._init()
            AppController.instance = this
        }

        return AppController.instance
    }
}

const AppControllerInstance = new AppController()
