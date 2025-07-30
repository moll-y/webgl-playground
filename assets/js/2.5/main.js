import {
  getWebGL2RenderingContext,
  compileShader,
  createAndLinkProgram,
} from "@/utils";

function main() {
  const gl = getWebGL2RenderingContext("2.5");

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
  const fshader1 = compileShader(
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
  const fshader2 = compileShader(
    gl,
    `#version 300 es                            \n
                                                \n
    precision highp float;                      \n
                                                \n
    out vec4 color;                             \n
                                                \n
    void main(void) {                           \n
        color = vec4(1.0, 1.0, 0.0, 1.0);       \n
    }`,
    gl.FRAGMENT_SHADER,
  );

  const program1 = createAndLinkProgram(gl, vshader, fshader1);
  const program2 = createAndLinkProgram(gl, vshader, fshader2);

  const vao1 = gl.createVertexArray();
  const vbo1 = gl.createBuffer();
  // Binding.
  gl.bindVertexArray(vao1);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo1);
  // Settings.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, 0, 0, 1, 0, 0, 0, 1, -0.5, 1, 0, 1]),
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

  const vao2 = gl.createVertexArray();
  const vbo2 = gl.createBuffer();
  // Binding.
  gl.bindVertexArray(vao2);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo2);
  // Settings.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0.5, -1, 0, 1]),
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
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program1);
    gl.bindVertexArray(vao1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(program2);
    gl.bindVertexArray(vao2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
