/* global THREE:true */
/* exported AssetManager */

const AssetManager = (function () {
    let ready = false
    let promises = []
    let instance = {
        shaders: {},
        fonts: {},
        textures: {},
        json: {},
        achievements: {},
        presets: {}
    }
    const baseDir = "assets/"
    const presets = ["simple_line", "NOT_gate", "majority_gate", "AND_gate", "OR_gate", "five_majority_gate", "NAND_gate", "security_majority_gate", "funny_QCA","mission_line"]

    // Font loading
    promises.push(new Promise((resolve, reject) => {
        const FONT_FILE_PATH = "assets/fonts/optimer_regular.typeface.json"
        new THREE.FontLoader().load(
            FONT_FILE_PATH,
            (optimer_regular) => {
                instance.fonts.optimer = optimer_regular
                resolve(self.fontCache)
            },
            undefined,
            reject)
    }))

    // Textures Loading
    promises.push(waitTexture("dot"))
    promises.push(waitTexture("electron"))
    promises.push(waitTexture("positive_input"))
    promises.push(waitTexture("negative_input"))

    // Skybox loading
    const createUrl = (name) => baseDir + "textures/skybox/" + name + ".png"
    const urlsLight = [
        createUrl("right_light"),
        createUrl("left_light"),
        createUrl("top_light"),
        createUrl("bottom_light"),
        createUrl("back_light"),
        createUrl("front_light")
    ]
    const urlsDark = [
        createUrl("right_dark"),
        createUrl("left_dark"),
        createUrl("top_dark"),
        createUrl("bottom_dark"),
        createUrl("back_dark"),
        createUrl("front_dark")
    ]
    promises.push(new Promise((resolve, reject) => {
        new THREE.CubeTextureLoader()
            .setCrossOrigin(true)
            .load(
                urlsLight,
                (texture) => {
                    instance.textures.skyboxLight = texture
                    resolve(texture)
                },
                undefined,
                reject
            )
    }))
    promises.push(new Promise((resolve, reject) => {
        new THREE.CubeTextureLoader()
            .setCrossOrigin(true)
            .load(
                urlsDark,
                (texture) => {
                    instance.textures.skyboxDark = texture
                    resolve(texture)
                },
                undefined,
                reject
            )
    }))

    // Shader loading
    let options = {
        method: "GET"
    }
    const vs = baseDir + "/shaders/influences.vs.glsl"
    promises.push(fetch(vs, options)
        .then(response => {
            if (response.ok) {
                return response.text()
                    .then(text => {
                        instance.shaders["influences.vs.glsl"] = text
                    })
            } else {
                return Promise.reject(Error("error"))
            }
        })
        .catch(err => Promise.reject(Error(err.message))))
    const fs = baseDir + "/shaders/influences.fs.glsl"
    promises.push(fetch(fs, options)
        .then(response => {
            if (response.ok) {
                return response.text()
                    .then(text => {
                        instance.shaders["influences.fs.glsl"] = text
                    })
            } else {
                return Promise.reject(Error("error"))
            }
        })
        .catch(err => Promise.reject(Error(err.message))))

    // Preset loading
    presets.forEach(name => {
        promises.push(new Promise((resolve, reject) => {
            readJSON(name, "presets")
                .then(() => {
                    instance.presets[name] = instance.json[name]
                    delete instance.json[name]
                    resolve()
                })
                .catch(reject)
        }))
    })

    // JSON Intros 
    promises.push(readJSON("electronIntro"))
    promises.push(readJSON("dotIntro"))
    promises.push(readJSON("dotIntro2"))
    promises.push(readJSON("qubitIntro"))
    promises.push(readJSON("qubitIntro2"))
    promises.push(readJSON("qubitIntro3"))
    promises.push(readJSON("outputIntro"))
    promises.push(readJSON("inputIntro"))

    // JSON achievement
    promises.push(new Promise((resolve, reject) => {
        readJSON("achievements")
            .then(() => {
                // Load all the images
                for (let key in instance.json.achievements) {
                    let achievement = instance.json.achievements[key]
                    if (achievement.image && achievement.imageExtension)
                        promises.push(waitTexture(achievement.image, achievement.imageExtension, "textures", "achievements"))
                }
                resolve()
            })
            .catch(reject)
    }))

    // JSON facts
    promises.push(new Promise((resolve, reject) => {
        readJSON("facts").then(() => {
            resolve()
        }).catch(reject)
    }))

    promises.push(waitTexture("default", ".png", "textures", "achievements"))

    // Return value
    Promise.all(promises)
        .then(() => ready = true)
        .catch(err => console.error(err))

    return {
        Get: () => {
            if (ready)
                return instance
            else return undefined
        },
        Create: () => Promise.all(promises)
    }

    // Utils
    function waitTexture(filename, ext = ".png", folder = "textures", subfolder = "") {
        let path = baseDir + folder + "/"
        if (subfolder)
            path += subfolder + "/"
        path += filename + ext
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader()
                .setCrossOrigin(true)
                .load(
                    path,
                    (texture) => {
                        if (subfolder)
                            instance[subfolder][filename] = texture
                        else
                            instance[folder][filename] = texture
                        resolve(texture)
                    },
                    undefined,
                    (err) => {
                        console.error(err)
                        reject(err)
                    }
                )
        })
    }

    function readJSON(filename, dir = "data") {
        const path = baseDir + dir + "/" + filename + ".json"
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("GET", path, true)
            xhr.responseType = "blob"
            xhr.onload = function () {
                if (this.status == 200) {
                    let file = new File([this.response], "temp")
                    let fileReader = new FileReader()
                    fileReader.addEventListener("load", (r) => {
                        let json = JSON.parse(r.target.result)
                        instance.json[filename] = json
                        resolve(json)
                    })
                    fileReader.readAsText(file)
                } else {
                    reject(this)
                }
            }
            xhr.send()
        })
    }
})()
