/* 
    global 
    ThreeViewControllerInstance,
    Qubit,
    Dot,
    Electron,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditorCursor,
*/
AssetManager.Create().then(() => {
    console.log("Assets:", AssetManager.Get())

    // Achivement
    console.log("Achievements:", AchievementManager.Get())

    ThreeViewControllerInstance.init()
    Dot.init()
    Electron.init()
    InputBlock.init()

    ThreeViewControllerInstance.addObjectToScene((new Qubit(new THREE.Vector3(0, 0, 0))).object)
    ThreeViewControllerInstance.addObjectToScene((new Qubit(new THREE.Vector3(0, 0, 3))).object)
    ThreeViewControllerInstance.addObjectToScene((new Qubit(new THREE.Vector3(-3, 0, -3))).object)

    new QubitEditorCursor()

    AchievementManager.Get().obtained("missionOne")

    ToolboxControllerInstance.init()

})