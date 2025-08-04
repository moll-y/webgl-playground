#version 300 es

layout (location = 0) in vec3 a_position;
layout (location = 1) in vec3 a_color;

uniform mat4 u_view_matrix;

out vec4 v_color;

void main() {
	gl_Position =  u_view_matrix * vec4(a_position, 1);
	v_color = vec4(a_color, 1);
}
