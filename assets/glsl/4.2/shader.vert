#version 300 es

layout (location = 0) in vec4 a_position;
layout (location = 1) in vec4 a_color;
layout (location = 2) in vec2 a_tex_coordinate;

out vec2 tex_coord;
out vec4 color;

void main() {
    gl_Position = a_position;
    tex_coord = a_tex_coordinate;
    color = a_color;
}
