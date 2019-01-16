/* global ThreeViewController:true, THREE:true, Qubit:true, AssetManager:true */
/* exported orbit */

console.log(AssetManager.Get())
AssetManager.Create().then(() => {
    console.log(AssetManager.Get())
})


const threeController = new ThreeViewController("viewport")
//threeController.startRenderLoop()


let testQubitA = new Qubit()
let testQubitB = new Qubit(new THREE.Vector3(0, 0, 3))
let testQubitC = new Qubit(new THREE.Vector3(-3, 0, -3))

threeController.addObject(testQubitA.object)
threeController.addObject(testQubitB.object)
threeController.addObject(testQubitC.object)

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

var influenceOverlay = new InfluenceOverlay(threeController)
var cursorEditor = new QubitEditorCursor(threeController)
ToolboxController.init(threeController)

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)
