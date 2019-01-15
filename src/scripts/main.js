/* global ThreeViewController:true, THREE:true, Qubit:true */
/* exported orbit */

const threeController = new ThreeViewController("viewport")
//threeController.startRenderLoop()


let testQubitA = new Qubit()
let testQubitB = new Qubit()
let testQubitC = new Qubit()

testQubitB.move(0, 3)
testQubitC.move(-3, -3)

threeController.addObject(testQubitA.object)
threeController.addObject(testQubitB.object)
threeController.addObject(testQubitC.object)


/*
document.addEventListener("click", () => {
    threeController.addCube(Math.random() * 4, Math.random() * 4, Math.random())
})
*/

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

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)
