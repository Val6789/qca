#ifdef GL_ES
  	precision mediump float;
#endif

uniform float pointSize;
uniform float viewportHeight;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = pointSize * viewportHeight/gl_Position.z;
}
