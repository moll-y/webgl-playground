import vertshader from "@glsl/7.4/shader.vert";
import fragshader from "@glsl/7.4/shader.frag";
import { mat4 } from "gl-matrix";

function main() {
  const canvas = document.getElementById("7.4");
  if (canvas === null) {
    throw new Error("No matching element was found in the document.");
  }
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    throw new Error(
      "Context identifier is not supported, or the canvas has already been set to a different context mode.",
    );
  }

  const vshader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(vshader, vertshader);
  gl.compileShader(vshader);
  if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
    throw new Error(
      `Could not compile shader.vert: ${gl.getShaderInfoLog(vshader)}`,
    );
  }

  const fshader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(fshader, fragshader);
  gl.compileShader(fshader);
  if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
    throw new Error(
      `Could not compile shader.frag: ${gl.getShaderInfoLog(fshader)}`,
    );
  }

  const program = gl.createProgram();
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Could not link shaders: ${gl.getProgramInfoLog(program)}`);
  }
  gl.deleteShader(vshader);
  gl.deleteShader(fshader);

  gl.enable(gl.DEPTH_TEST);

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();
  const ebo = gl.createBuffer();

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      -0.5, -0.5,  0.5, 1, 0, 0,
      -0.5,  0.5,  0.5, 1, 0, 0,
       0.5, -0.5,  0.5, 1, 0, 0,
       0.5,  0.5,  0.5, 1, 0, 0,

      -0.5, -0.5, -0.5, 0, 1, 0,
      -0.5,  0.5, -0.5, 0, 1, 0,
       0.5, -0.5, -0.5, 0, 1, 0,
       0.5,  0.5, -0.5, 0, 1, 0,
    ]),
    gl.STATIC_DRAW,
  );

  gl.vertexAttribPointer(
    0,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(0);

  gl.vertexAttribPointer(
    1,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(1);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    // prettier-ignore
    new Uint32Array([
      0, 1, 2, 1, 2, 3,
      4, 5, 6, 5, 6, 7,

      1, 3, 5, 3, 5, 7,
      0, 2, 4, 2, 4, 6,

      0, 1, 4, 1, 4, 5,
      2, 3, 6, 3, 6, 7,
    ]),
    gl.STATIC_DRAW,
  );

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const uViewMatrix = gl.getUniformLocation(program, "u_view_matrix");
  if (uViewMatrix === null) {
    throw new Error('Could not get uniform location for "u_view_matrix".');
  }

  function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniformMatrix4fv(
      uViewMatrix,
      false,
      mat4.lookAt(mat4.create(), [1, 1, 1], [0, 0, 0], [0, 1, 0]),
    );

    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
