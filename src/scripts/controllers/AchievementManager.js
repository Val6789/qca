/*
    exported
    AchievementManager
*/


/*

    Debug messages are displayed for the AchievementManager, change the 'const DEBUG' to false to disable them

    In order, to load new achievements from the 'achievement.json file, you need to manually call AchivementManager.Get().wipe() then AchivementManager.Get().load() or reload the page.
    If you don't wipe, data are loaded from the localStorage and ignore the json file

*/

const AchievementManager = (function () {

    const DEBUG = false
    let instance
    let observers = []

    /* ================== PUBLIC ================== */
    const load = () => {
        let item = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!item) {
            instance.achievements = AssetManager.Get().json.achievements
            store()
        } else {
            item = JSON.parse(item)
            instance.achievements = item
        }
        verifyJSON()
    }
    const store = () => {
        console.assert(instance.achievements, "No achievements in store")
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(instance.achievements)
        )
    }
    const wipe = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        instance.achievements = undefined
    }
    const obtained = (name) => {
        let achievement = instance.achievements[name]
        console.assert(achievement)
        if (achievement.fullfilled)
            return
        if (DEBUG)
            console.trace("Achievement : " + name)

        // Now update this achievement
        achievement.fullfilled = true
        store()

        let iziToastOptions = {
            title: achievement.fullname,
            message: achievement.message,
            position: "bottomCenter",
            layout: 2,
            image: "assets/textures/achievements/default.png"
        }
        if (achievement.image) {
            iziToastOptions.image = "assets/textures/achievements/" + achievement.image + achievement.imageExtension
        }
        iziToast.success(iziToastOptions)

    }
    
    const done = (achievement) => instance.achievements[achievement].fullfilled

    return {
        Get: () => {
            if (!instance)
                return create()
            else return instance
        },
        OnReady: (callback) => {
            observers.push(callback)
        }
    }

    /* ================== PRIVATE ================== */
    var LOCAL_STORAGE_KEY = "achievements"

    function create() {
        instance = {}
        instance.load = load
        instance.store = store
        instance.wipe = wipe
        instance.obtained = obtained
        instance.done = done
        load()

        if (DEBUG) {
            console.info("%cDebug messages are displayed for the AchievementManager, change the 'const DEBUG' to false to disable them.", "font-weight: bold;")
            console.info("In order, to load new achievements from the 'achievement.json file, you need to manually call AchivementManager.Get().wipe() then AchivementManager.Get().load() or reload the page.\nIf you don't wipe, data are loaded from the localStorage and ignore the json file")
        }

        observers.forEach((callback) => {
            callback()
        })


        return instance
    }

    function verifyJSON() {
        console.assert(instance.achievements, "No achievements in store")

        for (let key in instance.achievements) {
            let achievement = instance.achievements[key]

            // fullname
            console.assert(typeof achievement["fullname"] == "string", key + "[fullname] is not a string")
            console.assert(achievement["fullname"].length != 0, key + "[fullname] is empty")

            // fullfilled
            console.assert(typeof achievement["fullfilled"] == "boolean", key + "[fullfilled] is not a boolean")

            // Description
            console.assert(typeof achievement["description"] == "string", key + "[description] is not a string")
            console.assert(achievement["description"].length, key + "[description] is empty")

            // message
            console.assert(typeof achievement["message"] == "string", key + "[message] is not a string")
            console.assert(achievement["message"].length, key + "[message] is empty")
        }

    }
})()