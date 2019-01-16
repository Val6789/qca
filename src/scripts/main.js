/* 
    global 
    ThreeViewController:true,
    THREE:true,
    Qubit:true,
    AssetManager:true,
    ToolboxController:true
*/
/* exported orbit */

let threeController
AssetManager.Create().then(() => {
    console.log("Assets:", AssetManager.Get())
    threeController = new ThreeViewController("viewport")

    let testQubitA = new Qubit()
    let testQubitB = new Qubit(new THREE.Vector3(0, 0, 3))
    let testQubitC = new Qubit(new THREE.Vector3(-3, 0, -3))

    threeController.addObject(testQubitA.object)
    threeController.addObject(testQubitB.object)
    threeController.addObject(testQubitC.object)
    threeController.addObject(testQubitA.valueText)


    var influenceOverlay = new InfluenceOverlay(threeController)
    var cursorEditor = new QubitEditorCursor(threeController)
    ToolboxController.init(threeController)

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
