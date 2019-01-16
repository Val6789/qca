/* global THREE:true, */
/* exported Grid */

class Grid {
    constructor(font, size = 10, divisions = 10) {
        this.object = new THREE.GridHelper(size, divisions)
        this.object.position.set(-0.5, 0, -0.5)

        this.hitzone = new THREE.Mesh(new THREE.PlaneGeometry(size,size));
        this.hitzone.lookAt(0,1,0)
        this.hitzone.material.visible = false;
        this.object.add(this.hitzone);

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        })

        this.size = 0.3
        this.height = 0
        this.curveSegments = 4
        this.bevelEnabled = false
        let t_xp = new THREE.TextGeometry("+x", {
            font: font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled
        })
        let t_yp = new THREE.TextGeometry("+y", {
            font: font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled
        })
        let t_xn = new THREE.TextGeometry("-x", {
            font: font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled
        })
        let t_yn = new THREE.TextGeometry("-y", {
            font: font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled
        })

        this.t_xp = new THREE.Mesh(t_xp, material)
        this.t_xn = new THREE.Mesh(t_xn, material)
        this.t_yp = new THREE.Mesh(t_yp, material)
        this.t_yn = new THREE.Mesh(t_yn, material)

        this.object.add(this.t_xp)
        this.object.add(this.t_xn)
        this.object.add(this.t_yp)
        this.object.add(this.t_yn)

        const distance = (size / 2) + 1
        this.t_xp.position.set(+distance, 0, 0)
        this.t_xn.position.set(-distance, 0, 0)
        this.t_yp.position.set(0, 0, +distance)
        this.t_yn.position.set(0, 0, -distance)
    }

    lookCamera(cameraPosition) {
        // rotation
        this.t_xp.lookAt(cameraPosition)
        this.t_xn.lookAt(cameraPosition)
        this.t_yp.lookAt(cameraPosition)
        this.t_yn.lookAt(cameraPosition)

        // scale
        const scaleXP = cameraPosition.distanceTo(this.t_xp.position) * this.size / 3
        const scaleXN = cameraPosition.distanceTo(this.t_xn.position) * this.size / 3
        const scaleYP = cameraPosition.distanceTo(this.t_yp.position) * this.size / 3
        const scaleYN = cameraPosition.distanceTo(this.t_yn.position) * this.size / 3

        this.t_xp.scale.set(scaleXP, scaleXP, scaleXP)
        this.t_xn.scale.set(scaleXN, scaleXN, scaleXN)
        this.t_yp.scale.set(scaleYP, scaleYP, scaleYP)
        this.t_yn.scale.set(scaleYN, scaleYN, scaleYN)
    }
}