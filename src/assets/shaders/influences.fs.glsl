#ifdef GL_ES
	precision mediump float;
#endif

varying vec3 electronPlanarPosition;

const vec3 color = vec3(1.0,1.0,1.0);

void main(void)
{
	float value = (0.5 - length(gl_PointCoord - vec2(0.5, 0.5)))* 2.2;
	
	gl_FragColor += vec4(value, 0, 0, value);

}
