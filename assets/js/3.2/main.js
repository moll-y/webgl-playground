import {
  getWebGL2RenderingContext,
  compileShader,
  createAndLinkProgram,
} from "@/utils";

function main() {
  const gl = getWebGL2RenderingContext("3.2");

  const vshader = compileShader(
    gl,
    `#version 300 es                            \n
                                                \n
    layout (location = 0) in vec4 a_position;   \n
                                                \n
    layout (location = 1) in vec4 a_color;      \n
                                                \n
    out vec4 color;                             \n
                                                \n
    void main(void) {                           \n
        gl_Position = a_position;               \n
        color = a_color;                        \n
    }`,
    gl.VERTEX_SHADER,
  );
  const fshader = compileShader(
    gl,
    `#version 300 es                            \n
                                                \n
    precision highp float;                      \n
                                                \n
    in vec4 color;                              \n
                                                \n
    out vec4 out_color;                         \n
                                                \n
    void main(void) {                           \n
        out_color = color;                      \n
    }`,
    gl.FRAGMENT_SHADER,
  );

  const program = createAndLinkProgram(gl, vshader, fshader);

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();

  // Binding.
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // Settings.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.5, -0.5, 0, 1, 1, 0, 0, 1, -0.5, -0.5, 0, 1, 0, 1, 0, 1, 0.0, 0.5, 0, 1,
      0, 0, 1, 1,
    ]),
    gl.STATIC_DRAW,
  );
  // (position = 0)
  gl.vertexAttribPointer(
    0,
    4,
    gl.FLOAT,
    false,
    8 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(0);
  // (position = 1)
  gl.vertexAttribPointer(
    1,
    4,
    gl.FLOAT,
    false,
    8 * Float32Array.BYTES_PER_ELEMENT,
    4 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(1);

  // Unbinding.
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindVertexArray(vao);
  gl.useProgram(program);

  function render() {
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
