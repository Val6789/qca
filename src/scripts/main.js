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
    QubitEditor,
    AchievementManager
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

    setInterval(() => { test.polarity = !test.polarity }, 1000)

    new QubitEditor()

    AchievementManager.Get().obtained("missionOne")

    ToolboxControllerInstance.init()
    QubitEditorInstance.init()
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