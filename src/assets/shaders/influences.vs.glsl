#ifdef GL_ES
  	precision mediump float;
#endif

varying vec3 electronPlanarPosition;

void main() {
	electronPlanarPosition = vec3(modelViewMatrix * vec4(position, 1.0));
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = 5000.0/gl_Position.z;
}
