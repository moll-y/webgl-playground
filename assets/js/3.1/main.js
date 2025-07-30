import {
  getWebGL2RenderingContext,
  compileShader,
  createAndLinkProgram,
} from "@/utils";

function main() {
  const gl = getWebGL2RenderingContext("3.1");

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
    uniform vec4 u_color;                       \n
                                                \n
    void main(void) {                           \n
        color = u_color;                        \n
    }`,
    gl.FRAGMENT_SHADER,
  );

  const program = createAndLinkProgram(gl, vshader, fshader);
  const ucolor = gl.getUniformLocation(program, "u_color");
  if (ucolor === null) {
    throw new Error("'ucolor' variable doesn't exist.");
  }

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.5, -0.5, 0, 1, -0.5, -0.5, 0, 1, 0.0, 0.5, 0, 1]),
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

  function render(timestamp) {
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform4fv(
      ucolor,
      new Float32Array([0, Math.sin(timestamp) / 2 + 0.5, 0, 1]),
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
