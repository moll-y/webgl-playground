import {
  getWebGL2RenderingContext,
  compileShader,
  createAndLinkProgram,
} from "@/utils";

function main() {
  const gl = getWebGL2RenderingContext("2.1");

  const vshader = compileShader(
    gl,
    `#version 300 es                            \n
                                                \n
    layout (location = 0) in vec4 position;     \n
                                                \n
    void main(void) {                           \n
        gl_Position = position;                 \n
    }`,
    gl.VERTEX_SHADER,
  );
  const fshader = compileShader(
    gl,
    `#version 300 es                            \n
                                                \n
    precision highp float;                      \n
                                                \n
    out vec4 color;                             \n
                                                \n
    void main(void) {                           \n
        color = vec4(0.0, 0.8, 1.0, 1.0);       \n
    }`,
    gl.FRAGMENT_SHADER,
  );

  const program = createAndLinkProgram(gl, vshader, fshader);

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();
  const ebo = gl.createBuffer();
  // Binding.
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  // Settings.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.5, 0.5, 0, 1, 0.5, -0.5, 0, 1, -0.5, -0.5, 0, 1, -0.5, 0.5, 0, 1,
    ]),
    gl.STATIC_DRAW,
  );
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint32Array([0, 1, 3, 1, 2, 3]),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(
    0,
    4,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(0);
  // Unbinding.
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  function render() {
    gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 1]);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
