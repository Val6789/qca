// Activity selection handling
document.getElementById("toggle-activity-tab")
    .addEventListener("click", (e) => {
        e.stopPropagation()
        e.preventDefault()
        let cssList = document.getElementById("activities").classList
        console.log(cssList)
        if (cssList.contains("active")) {
            cssList.remove("active")
            cssList.add("inactive")
        } else {
            cssList.remove("inactive")
            cssList.add("active")
        }
        return false
    })