#version 300 es

precision highp float;

in vec2 tex_coord;

out vec4 color;

uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;

void main() {
    // linearly interpolate between both textures (80% container, 20% awesomeface).
    color = mix(texture(u_texture_1, tex_coord), texture(u_texture_2, tex_coord), 0.2);
}
