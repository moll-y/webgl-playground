#version 300 es

precision highp float;

in vec3 out_color;
in vec2 tex_coord;

out vec4 color;

uniform sampler2D u_texture;

void main() {
    color = texture(u_texture, tex_coord);
}
