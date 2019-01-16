/* global THREE:true */
/* exported AssetManager */

const AssetManager = (function () {
    let ready = false
    let promises = []
    let instance = {
        shaders: {},
        fonts: {},
        textures: {}
    }
    const baseDir = "assets/"

    // Font loading
    promises.push(new Promise((resolve, reject) => {
        const FONT_FILE_PATH = "assets/fonts/optimer_regular.typeface.json"
        new THREE.FontLoader().load(
            FONT_FILE_PATH,
            (optimer) => {
                instance.fonts.optimer = optimer
                resolve(self.fontCache)
            },
            undefined,
            reject)
    }))

    // Textures Loading
    promises.push(waitTexture("circle"))
    promises.push(waitTexture("disc"))
    promises.push(waitTexture("dot"))
    promises.push(waitTexture("electron"))

    // Skybox loading
    const createUrl = (name) => baseDir + "textures/skybox/" + name + ".png"
    const urls = [
        createUrl("right"),
        createUrl("left"),
        createUrl("top"),
        createUrl("bottom"),
        createUrl("back"),
        createUrl("front")
    ]
    promises.push(new Promise((resolve, reject) => {
        new THREE.CubeTextureLoader()
            .setCrossOrigin(true)
            .load(
                urls,
                (texture) => {
                    instance.textures.skybox = texture
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

    // Return value
    Promise.all(promises).then(() => ready = true)
    return {
        Get: () => {
            if (ready)
                return instance
            else return undefined
        },
        Create: () => Promise.all(promises)
    }

    // Utils
    function waitTexture(filename) {
        const path = baseDir + "textures/" + filename + ".png"
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader()
                .setCrossOrigin(true)
                .load(
                    path,
                    (texture) => {
                        instance.textures[filename] = texture
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
})()
