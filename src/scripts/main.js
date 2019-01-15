var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()

var testQubitA = new Qubit()
var testQubitB = new Qubit()
var testQubitC = new Qubit()

testQubitB.move(0,3)
testQubitC.move(-3, -3)

threeController.addObject(testQubitA.object)
threeController.addObject(testQubitB.object)
threeController.addObject(testQubitC.object)


function toggleActivityPanel() {
    var cssList = document.getElementById("activities").classList
    if (cssList.contains("active")) {
        cssList.remove("active")
        cssList.add("inactive")
    } else {
        cssList.remove("inactive")
        cssList.add("active")
    }
}

var influenceOverlay = new InfluenceOverlay(threeController)

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)
