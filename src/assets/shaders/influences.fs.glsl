#ifdef GL_ES
	precision mediump float;
#endif

uniform vec3 color;
uniform float opacity;

void main(void)
{
	float value = (0.5 - length(gl_PointCoord - vec2(0.5, 0.5)))* 2.0;
	if(value > 1.0) discard;
	gl_FragColor += vec4(color,opacity) * value * value;
}
