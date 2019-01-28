/*
    exported
    MissionManager
*/


/*

    Debug messages are displayed for the MissionManager, change the 'const DEBUG' to false to disable them

    In order, to load new achievements from the 'mission.json file, you need to manually call MissionManager.Get().wipe() then MissionManager.Get().load() or reload the page.
    If you don't wipe, data are loaded from the localStorage and ignore the json file

*/

const MissionManager = (function () {

    const DEBUG = false
    let instance
    let observers = {
        ready: [],
        update: []
    }
    let currentMission
    var LOCAL_STORAGE_KEY = "missions"

    /* ================== PUBLIC ================== */
    const store = () => {
        console.assert(instance.missions, "No missions in store")
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(instance.missions)
        )
    }
    const load = () => {
        let item = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!item) {
            instance.missions = AssetManager.Get().json.missions
            store()
        } else {
            item = JSON.parse(item)
            instance.missions = item
        }
        verifyJSON()
    }
    const wipe = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        instance.missions = undefined
    }
    const start = (name) => {
        let mission = instance.missions[name]
        console.assert(mission)

        if (DEBUG)
            console.trace("Mission : " + name)

        let presetName = mission.preset
        let presetJson = AssetManager.Get().presets[presetName]

        UxSaverInstance.add('startMission', name)
        console.assert(presetJson, "No preset " + presetName + " in AssetManager")

        let constructedPreset = new Preset(presetName, presetJson)

        constructedPreset.addToAutomata(new AppController().automata, true)

        currentMission = name

    }
    const obtained = () => {

        let mission = instance.missions[currentMission]
        if (!mission) return
        if (DEBUG)
            console.trace("Mission Complete : " + currentMission)

        UxSaverInstance.add('obtainMission', name)

        // Now update this mission
        mission.fullfilled = true
        store()

        let iziToastOptions = {
            title: mission.fullname,
            message: mission.message,
            position: "bottomCenter",
            layout: 2,
            image: "assets/textures/achievements/default.png"
        }
        if (mission.image) {
            iziToastOptions.image = "assets/textures/missions/" + mission.image + mission.imageExtension
        }
        iziToast.success(iziToastOptions)

        observers.update.forEach((callback) => {
            callback(mission, currentMission)
        })

        if (currentMission == "one")
            AchievementManager.Get().obtained("missionOne")
        currentMission = undefined

    }

    return {
        Get() {
            if (!instance)
                return create()
            else return instance
        },
        OnReady: (callback) => {
            observers.ready.push(callback)
        },
        OnUpdate: (callback) => {
            observers.update.push(callback)
        }
    }

    /* ================== PRIVATE ================== */

    function create() {
        instance = {}
        instance.load = load
        instance.store = store
        instance.wipe = wipe
        instance.start = start
        instance.obtained = obtained
        load()

        if (DEBUG) {
            console.info("%cDebug messages are displayed for the MissionManager, change the 'const DEBUG' to false to disable them.", "font-weight: bold;")
            console.info("In order, to load new missions from the 'mission.json file, you need to manually call MissionManager.Get().wipe() then MissionManager.Get().load() or reload the page.\nIf you don't wipe, data are loaded from the localStorage and ignore the json file")
        }

        observers.ready.forEach((callback) => {
            callback()
        })


        return instance
    }

    function verifyJSON() {
        console.assert(instance.missions, "No missions in store")

        for (let key in instance.missions) {
            let mission = instance.missions[key]

            // fullname
            console.assert(typeof mission["fullname"] == "string", key + "[fullname] is not a string")
            console.assert(mission["fullname"].length != 0, key + "[fullname] is empty")

            // fullfilled
            console.assert(typeof mission["fullfilled"] == "boolean", key + "[fullfilled] is not a boolean")

            // Description
            console.assert(typeof mission["description"] == "string", key + "[description] is not a string")
            console.assert(mission["description"].length, key + "[description] is empty")

            // message
            console.assert(typeof mission["message"] == "string", key + "[message] is not a string")
            console.assert(mission["message"].length, key + "[message] is empty")
        }

    }
})()
