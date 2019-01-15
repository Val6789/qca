var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
threeController.addCube(0,0,1)


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

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)
