/* global ThreeViewController:true, THREE:true, Qubit:true */
/* exported orbit */

Dot.init(ThreeViewControllerInstance.scene).then(particules => {
    ThreeViewControllerInstance.addObjectToScene(particules)
})

Electron.init(ThreeViewControllerInstance.scene).then(particules => {
    ThreeViewControllerInstance.addObjectToScene(particules)
})

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


var cursorEditor = new QubitEditorCursor(ThreeViewControllerInstance)
ToolboxController.init(ThreeViewControllerInstance)

document.getElementById("toggle-activity-tab").addEventListener("click", toggleActivityPanel)
