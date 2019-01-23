/* 
    global 
    ThreeViewControllerInstance
    Electron
    ParticleSystem
    TweenLite
    TimelineLite
    ToolboxControllerInstance
*/
/* 
    exported 
    IntroScene
*/

class IntroScene {
    constructor(callbackDone) {
        this.callbackDone = callbackDone
        this._scene = new THREE.Scene()

        let pos = new THREE.Vector3(0, 0, 0)
        this._particles = new ParticleSystem([Electron._getSolidMaterial(), Electron._getInfluenceMaterial()])
        this._particles.addAt(pos)
        this._scene.add(this._particles._particlesGroup)

        let light = new THREE.PointLight(0xffffff, 1, 100)
        light.position.set(-5, 0, 0)
        this._scene.add(light)
        this.TEXT_MATERIAL = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1

        })
        this.TEXT_GEOMETRY_OPTIONS = {
            font: AssetManager.Get().fonts.optimer,
            size: 0.25,
            height: 0.1,
            curveSegments: 8,
            bevelEnabled: false
        }
        this.UPDATE_FUNCTION = () => {
            ThreeViewControllerInstance.shouldRender()
        }

    }

    /**
     * @brief called by the main instance to add the layer here
     * @param {*} layer 
     */
    setLayer(layer) {
        this.layer = layer
    }

    setCamera(camera) {
        this._camera = camera
    }

    async start() {
        this._setupScene()
        await this._welcomeScene()
        await this._choiceScene()
        await this._electronScene()
        this._deleteScene()
        this.callbackDone()
    }
    
    _setupScene() {

        // Update GUI
        ToolboxControllerInstance.hideUI()
        
    }

    _welcomeScene() {
        return new Promise((resolve) => {
            // Camera movement
            let camPos = this._camera.position
            TweenLite.to(camPos, 5, {
                x: "+=4",
                onUpdate: this.UPDATE_FUNCTION,
                onComplete: resolve
            })

            // Timeline
            let timeline = new TimelineLite()
            const rotation = new THREE.Vector3(-4, 0, 0)
            const TIMER_SPACE = 0.3
            let timing = 1
            let texts = []
            const lineDisplay = (startY, startZ, line) => {
                line = line.split(" ")
                let y = startY
                let z = startZ
                for (let i = 0; i < line.length; i++) {
                    let word = line[i]
                    let txt = this._createTextMesh(word, 0, y, z, rotation)
                    timeline.fromTo(txt.position, 1, txt.from, txt.to, timing)
                    texts.push(txt)
                    z += txt.length / 2 + 0.1
                    timing += TIMER_SPACE
                }
            }

            const clearTexts = () => {
                timing += 1
                timeline.to(texts[0].material, 1, {
                    opacity: 0,
                    onComplete: () => {
                        for (let i = 0; i < texts.length; i++) {
                            this._scene.remove(texts[i])
                        }
                    }
                }, timing)
            }

            // Fist two lines
            lineDisplay(1.3, -0.35, "Hello")
            lineDisplay(0.8, -0.85, "Welcome to")
            lineDisplay(-0.9, -1.15, "QCA Simulator")
            clearTexts()
            timeline.eventCallback("onComplete", () => {
                setTimeout(resolve, 1000)
            })

        })
    }
    
    _choiceScene() {
        return new Promise(async (resolve) => {
            ToolboxControllerInstance.revealChoice()
        })
    }

    _electronScene() {
        return new Promise(async (resolve) => {
            ToolboxControllerInstance.revealInfoHolder()
            ToolboxControllerInstance.setInfoHolderTitle("Electron")
            let lineLatency = 1000
            let timeout, endline
            const addLine = (text) => {
                return new Promise(littleResolve => {
                    endline = () => {
                        ToolboxControllerInstance.addInfoHolderText(text)
                        // Letter per second
                        const avgReadingSpeed = 25.25
                        lineLatency = avgReadingSpeed * text.length
                        littleResolve()
                        timeout = null
                        endline = null
                    }
                    timeout = setTimeout(endline, lineLatency)
                })
            }
            const lineCallback = () => {
                if (timeout)
                    clearTimeout(timeout)
                if (endline)
                    endline()
            }
            const paragraphCallBack = () => {
                return new Promise(resolve => {
                    ToolboxControllerInstance.setInfoHolderNextClickCallback(() => {
                        resolve()
                    })
                })

            }
            const json = AssetManager.Get().json.electronIntro

            for (let i = 0; i < json.length; i++) {
                const paragraph = json[i]
                ToolboxControllerInstance.setInfoHolderNextClickCallback(lineCallback)
                for (let j = 0; j < paragraph.length; j++) {
                    const line = paragraph[j]
                    await addLine(line)
                }

                // Paragraph finished
                await paragraphCallBack()
                ToolboxControllerInstance.clearInfoHolder()
                lineLatency = 0
            }

            // Clear
            resolve()
        })

    }

    _deleteScene() {
        ToolboxControllerInstance.revealUI()
        ToolboxControllerInstance.hideInfoHolder()
        Utils.doDispose(this._scene)
        this._particles._destructor()
        AchievementManager.Get().obtained("tutorial")
    }

    _createTextMesh(text, x, y, z) {
        let geo = new THREE.TextGeometry(text, this.TEXT_GEOMETRY_OPTIONS)
        let mesh = new THREE.Mesh(geo, this.TEXT_MATERIAL)
        var box = new THREE.Box3().setFromObject(mesh)
        mesh.from = {
            x,
            y: y - 2,
            z
        }
        mesh.to = {
            x,
            y,
            z,
            onStart: () => {
                this._scene.add(mesh)
            },
            onUpdate: () => {
                this.UPDATE_FUNCTION()
                mesh.rotation.set(0, THREE.Math.degToRad(-90), 0)
            }
        }
        mesh.length = box.max.length() * 2
        return mesh
    }
}