/* global THREE:true */
/* exported DotDescriptor */

class DotDescriptor {
  constructor(position, color) {

    // Consts
    this.padding = 0.5
    this.radius = 0.25


    // Verify
    console.assert(position instanceof THREE.Vector3, position, "Parameter position is not an instance of THREE.Vector3")
    console.assert(color instanceof THREE.Color, color, "Parameter color is not an instance of THREE.Color")

    // Initialize
    this.color = color
    this.position = position
    this.electrons = []
  }

  addElectron(relativePosition) {
    console.assert(relativePosition instanceof THREE.Vector3,
      relativePosition,
      "Parameter relativePosition is not an instance of THREE.Vector3")

    this.electrons.push(relativePosition.normalize())
  }
}