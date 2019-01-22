/* 
    global 
    ThreeViewControllerInstance
    Electron
    ParticleSystem
    TweenLite
    TimelineLite
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
        var elecs = new ParticleSystem([Electron._getSolidMaterial(), Electron._getInfluenceMaterial()])
        elecs.addAt(pos)

        this._scene.add(elecs._particlesGroup)

        let light = new THREE.PointLight(0xffffff, 1, 100)
        light.position.set(-5, 0, 0)
        this._scene.add(light)
        this.TEXT_MATERIAL = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1

        })
        const size = 0.25
        this.TEXT_GEOMETRY_OPTIONS = {
            font: AssetManager.Get().fonts.optimer,
            size: size,
            height: 0.1,
            curveSegments: 8,
            bevelEnabled: false
        }

        this.UPDATE_FUNCTION = () => {
            ThreeViewControllerInstance.shouldRender()
        }

        // Update GUI
        ToolboxControllerInstance.hideControls()

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
        //await this._welcomeScene()
        await this._electronScene()
        this.callbackDone()
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
                        const avgReadingSpeed = 20.25
                        lineLatency += avgReadingSpeed * text.length
                        console.log("New line latency :", lineLatency)
                        littleResolve()
                        timeout = null
                        endline = null
                    }
                    timeout = setTimeout(endline, lineLatency)
                })
            }
            ToolboxControllerInstance.setInfoHolderNextClickCallback(() => {
                if (timeout)
                    clearTimeout(timeout)
                if (endline)
                    endline()
            })
            await addLine("So this is an <b>electron</b>.")
            await addLine("An electron is something that exist in the <b>real world</b>.")
            await addLine("The real world is the place where most humans live.")
            await addLine("But you already know that.")
            await addLine("What you don't know is : <b>What's an electron ?</b>")

        })

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