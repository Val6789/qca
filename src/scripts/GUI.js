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

            // Remove id
            node.removeAttribute("id")

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