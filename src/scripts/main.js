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
AssetManager.Create().then(() => {
    ThreeViewControllerInstance.init()
    Dot.init()
    Electron.init()
    InputBlock.init()
    Qubit.startDeterminationUpdateLoop()
    new QubitEditor()
    AchievementManager.Get().obtained("missionOne")
    ToolboxControllerInstance.init()
    QubitEditorInstance.init()
})