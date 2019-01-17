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

    var test = new Qubit(new THREE.Vector3(0, 0, 0))
    ThreeViewControllerInstance.addObjectToScene(test.object)
    ThreeViewControllerInstance.addObjectToScene((new Qubit(new THREE.Vector3(0, 0, 3))).object)
    ThreeViewControllerInstance.addObjectToScene((new Qubit(new THREE.Vector3(-3, 0, -3))).object)

    setInterval(() => {
        test.polarity = !test.polarity
    }, 1000)

    new QubitEditor()

    AchievementManager.Get().obtained("missionOne")

    ToolboxControllerInstance.init()
    QubitEditorInstance.init()
})