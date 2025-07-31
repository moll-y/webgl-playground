import vshader from "@glsl/4.1/shader.vert";
import fshader from "@glsl/4.1/shader.frag";
import { getWebGL2RenderingContext } from "@/utils";
import { Shader } from "@/shader";

function main() {
  const gl = getWebGL2RenderingContext("4.1");
  const shader = new Shader(gl, vshader, fshader);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );

  // Because images have to be downloaded over the internet they might take a
  // moment until they are ready. Until then put a single pixel in the texture
  // so we can use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    1,
    1,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]),
  );

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = "/textures/4.1/container.jpg";

  const vao = gl.createVertexArray();
  const ebo = gl.createBuffer();
  const vbo = gl.createBuffer();

  // Binding.
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // Settings.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.5, 0.5, 0, 1, 1, 0, 0, 1, 1, 1, 0.5, -0.5, 0, 1, 0, 1, 0, 1, 1, 0, -0.5,
      -0.5, 0, 1, 0, 0, 1, 1, 0, 0, -0.5, 0.5, 0, 1, 1, 1, 0, 1, 0, 1,
    ]),
    gl.STATIC_DRAW,
  );
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint32Array([0, 1, 3, 1, 2, 3]),
    gl.STATIC_DRAW,
  );
  // (position = 0)
  gl.vertexAttribPointer(
    0,
    4,
    gl.FLOAT,
    false,
    10 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(0);
  // (position = 1)
  gl.vertexAttribPointer(
    1,
    4,
    gl.FLOAT,
    false,
    10 * Float32Array.BYTES_PER_ELEMENT,
    4 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(1);
  // (position = 2)
  gl.vertexAttribPointer(
    2,
    2,
    gl.FLOAT,
    false,
    10 * Float32Array.BYTES_PER_ELEMENT,
    8 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(2);

  // Unbinding.
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  function render() {
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.use();
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
