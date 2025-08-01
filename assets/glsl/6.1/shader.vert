#version 300 es

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec4 a_color;
layout (location = 2) in vec2 a_tex_coordinate;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec2 tex_coord;
out vec4 color;

void main() {
    gl_Position = u_projection * u_view * u_model * a_position;
    tex_coord = a_tex_coordinate;
    color = a_color;
}
