class Bridge {

    traverseIfIsAnEnterPoint(qubit) {
        if (qubit === this.start) return this.end
        if (qubit === this.end) return this.start
        return false
    }

    setDestination(qubit) {
        if(qubit === this.start) return
        this.end = qubit
        this._updateCurve(this.end.position)
        Bridge.pending = null
    }

    _updateCurve(endPosition) {
        ThreeViewControllerInstance.removeObjectFromScene(this._spline)
        this._spline = Bridge._createCurve(this.start.position, endPosition)
        ThreeViewControllerInstance.addObjectToScene(this._spline)
    }

    remove() {
        ThreeViewControllerInstance.removeObjectFromScene(this._spline)
        if (Bridge.pending === this)
            Bridge.pending = undefined
        return this
    }

    constructor(qubit) {
        if (Bridge.pending) throw console.error("Cannot create new bridge while another is pending")
        this.start = qubit
        this.end = undefined
        Bridge.pending = this
        QubitEditorInstance.callbackOnCursorMove(newposition => {
            if (!this.end) this._updateCurve(newposition)
        })
        this._updateCurve(QubitEditorInstance.cursor.position)
    }

    static _createCurve(from, to) {
        var curve = new THREE.CubicBezierCurve3();
        curve.v0.copy(from)
        curve.v1.copy(from)
        curve.v3.copy(to)
        curve.v2.copy(to)
        curve.v1.y += Bridge.SPLINE_CURVATURE
        curve.v2.y += Bridge.SPLINE_CURVATURE

        var points = curve.getPoints( 50 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );

        var material = new THREE.LineBasicMaterial({
            color : Bridge.SPLINE_COLOR
        })
        material.linewidth = Bridge.SPLINE_WIDTH

        // Create the final object to add to the scene
        return new THREE.Line( geometry, material )
    }
}

Bridge.SPLINE_CURVATURE = 2
Bridge.SPLINE_WIDTH = 3
Bridge.SPLINE_COLOR = 0xFF5555