/* 
    global 
    ThreeViewControllerInstance,
    THREE,
    Qubit,
    Dot,
    Electron,
    AssetManager,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditorCursor,
    AchievementManager
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


//threeController.startRenderLoop()

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)

function toggleActivityPanel(e) {
    e.stopPropagation()
    e.preventDefault()
    let cssList = document.getElementById("activities").classList
    if (cssList.contains("active")) {
        cssList.remove("active")
        cssList.add("inactive")
    } else {
        cssList.remove("inactive")
        cssList.add("active")
    }
    return false
}