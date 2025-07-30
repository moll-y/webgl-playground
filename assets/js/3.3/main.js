import vshader from "@glsl/3.3/shader.vert";
import fshader from "@glsl/3.3/shader.frag";
import { getWebGL2RenderingContext } from "@/utils";
import { Shader } from "@/shader";

function main() {
  const gl = getWebGL2RenderingContext("3.3");
  const shader = new Shader(gl, vshader, fshader);

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

  function render() {
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.use();
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
