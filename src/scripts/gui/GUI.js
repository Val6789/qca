/*
    global
    Skybox
*/
/*
    exported
    GUI
    GUIinstance

*/

// Activity selection handling

class GUI {
    constructor() {

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

        AchievementManager.OnReady(() => {
            let populateAchievements = (function () {
                const $achievements = document.getElementById("achievements-holder")
                const $template = document.getElementById("template-achievement")
                const achievements = AchievementManager.Get().achievements
                for (let key in achievements) {
                    let achievement = achievements[key]
                    let node = $template.cloneNode(true)

                    // Image
                    if (achievement.image) {
                        node.children[0].src = "assets/textures/achievements/" + achievement.image + achievement.imageExtension
                    }

                    // Title
                    node.children[1].innerText = achievement.fullname

                    // Description
                    node.children[2].innerText = achievement.description

                    // change id
                    node.id = key

                    // check for completion
                    if (achievement.fullfilled)
                        node.classList.add("done")

                    AchievementManager.OnUpdate((ac, k) => {
                        if (k === key)
                            ac.fullfilled ? node.classList.add("done") : node.classList.remove("done")
                    })

                    // Append
                    $achievements.appendChild(node)
                }
                $template.remove()
                return true
            })() || false
            console.assert(populateAchievements, "Achievements were not populated")

            let resize = (function () {
                const $achievements = document.getElementById("achievements-holder")

                function maxHeight() {
                    $achievements.style.height = "auto"
                    var height = ($achievements.offsetHeight)
                    height += $achievements.childElementCount * 20
                    height = height / 3
                    height += 100
                    $achievements.style.height = height + "px"
                }
                window.onresize = () => {
                    maxHeight()
                }
                maxHeight()
                return true
            })() || false
            console.assert(resize, "Resizing achievement in window failed")
        })

        MissionManager.OnReady(() => {
            let populateMissions = (function () {
                const $missions = document.getElementById("missions-holder")
                const $template = document.getElementById("template-mission")
                const missions = MissionManager.Get().missions
                for (let key in missions) {
                    let mission = missions[key]
                    let node = $template.cloneNode(true)

                    // Image
                    if (mission.image) {
                        node.children[0].src = "assets/textures/missions/" + mission.image + mission.imageExtension
                    }

                    // Title
                    node.children[1].innerText = mission.fullname

                    // Description
                    node.children[2].innerText = mission.description

                    // Remove id
                    node.id = key

                    // check for completion
                    if (mission.fullfilled)
                        node.classList.add("done")

                    node.onclick = () => {
                        MissionManager.Get().start(key)

                        document.getElementById('no-drawer-check').checked = true
                    }

                    MissionManager.OnUpdate((ac, k) => {
                        if (k === key)
                            ac.fullfilled ? node.classList.add("done") : node.classList.remove("done")
                    })

                    // Append
                    $missions.appendChild(node)
                }
                $template.remove()
                return true
            })() || false
            console.assert(populateMissions, "Missions were not populated")

            let resize = (function () {
                const $missions = document.getElementById("missions-holder")

                function maxHeight() {
                    $missions.style.height = "auto"
                    var height = ($missions.offsetHeight)
                    height += $missions.childElementCount * 20
                    height = height / 3
                    height += 100
                    $missions.style.height = height + "px"
                }
                window.onresize = () => {
                    maxHeight()
                }
                maxHeight()
                return true
            })() || false
            console.assert(resize, "Resizing mission in window failed")

        })

    }

}

const GUIinstance = new GUI()
