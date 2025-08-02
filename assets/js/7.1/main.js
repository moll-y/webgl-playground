import vshader from "@glsl/7.1/shader.vert";
import fshader from "@glsl/7.1/shader.frag";
import { getWebGL2RenderingContext, loadTexture } from "@/utils";
import { Shader } from "@/shader";
import { glMatrix, mat4 } from "gl-matrix";

function main() {
  const gl = getWebGL2RenderingContext("7.1");
  gl.enable(gl.DEPTH_TEST);

  const shader = new Shader(gl, vshader, fshader);
  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();

  // Binding.
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // Settings.
  // prettier-ignore
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -0.5, -0.5, -0.5,  0.0, 0.0,
       0.5, -0.5, -0.5,  1.0, 0.0,
       0.5,  0.5, -0.5,  1.0, 1.0,
       0.5,  0.5, -0.5,  1.0, 1.0,
      -0.5,  0.5, -0.5,  0.0, 1.0,
      -0.5, -0.5, -0.5,  0.0, 0.0,

      -0.5, -0.5,  0.5,  0.0, 0.0,
       0.5, -0.5,  0.5,  1.0, 0.0,
       0.5,  0.5,  0.5,  1.0, 1.0,
       0.5,  0.5,  0.5,  1.0, 1.0,
      -0.5,  0.5,  0.5,  0.0, 1.0,
      -0.5, -0.5,  0.5,  0.0, 0.0,

      -0.5,  0.5,  0.5,  1.0, 0.0,
      -0.5,  0.5, -0.5,  1.0, 1.0,
      -0.5, -0.5, -0.5,  0.0, 1.0,
      -0.5, -0.5, -0.5,  0.0, 1.0,
      -0.5, -0.5,  0.5,  0.0, 0.0,
      -0.5,  0.5,  0.5,  1.0, 0.0,

       0.5,  0.5,  0.5,  1.0, 0.0,
       0.5,  0.5, -0.5,  1.0, 1.0,
       0.5, -0.5, -0.5,  0.0, 1.0,
       0.5, -0.5, -0.5,  0.0, 1.0,
       0.5, -0.5,  0.5,  0.0, 0.0,
       0.5,  0.5,  0.5,  1.0, 0.0,

      -0.5, -0.5, -0.5,  0.0, 1.0,
       0.5, -0.5, -0.5,  1.0, 1.0,
       0.5, -0.5,  0.5,  1.0, 0.0,
       0.5, -0.5,  0.5,  1.0, 0.0,
      -0.5, -0.5,  0.5,  0.0, 0.0,
      -0.5, -0.5, -0.5,  0.0, 1.0,

      -0.5,  0.5, -0.5,  0.0, 1.0,
       0.5,  0.5, -0.5,  1.0, 1.0,
       0.5,  0.5,  0.5,  1.0, 0.0,
       0.5,  0.5,  0.5,  1.0, 0.0,
      -0.5,  0.5,  0.5,  0.0, 0.0,
      -0.5,  0.5, -0.5,  0.0, 1.0
    ]),
    gl.STATIC_DRAW,
  );
  // (position = 0)
  gl.vertexAttribPointer(
    0,
    3,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(0);
  // (position = 1)
  gl.vertexAttribPointer(
    1,
    2,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(1);

  // Unbinding.
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Textures.
  const uTexture1 = gl.getUniformLocation(shader.program, "u_texture_1");
  const uTexture2 = gl.getUniformLocation(shader.program, "u_texture_2");
  if (uTexture1 === null || uTexture2 === null) {
    throw new Error("Could not get uniform locations.");
  }

  loadTexture(
    gl,
    gl.TEXTURE0,
    0,
    "/textures/4.3/container.jpg",
    shader,
    uTexture1,
  );

  loadTexture(
    gl,
    gl.TEXTURE1,
    1,
    "/textures/4.3/awesomeface.png",
    shader,
    uTexture2,
  );

  const uModel = gl.getUniformLocation(shader.program, "u_model");
  const uView = gl.getUniformLocation(shader.program, "u_view");
  const uProjection = gl.getUniformLocation(shader.program, "u_projection");
  if (uModel === null || uView === null || uProjection === null) {
    throw new Error("Could not get uniform locations.");
  }

  const cubes = [
    [0.0, 0.0, 0.0],
    [2.0, 5.0, -15.0],
    [-1.5, -2.2, -2.5],
    [-3.8, -2.0, -12.3],
    [2.4, -0.4, -3.5],
    [-1.7, 3.0, -7.5],
    [1.3, -2.0, -2.5],
    [1.5, 2.0, -2.5],
    [1.5, 0.2, -1.5],
    [-1.3, 1.0, -1.5],
  ];

  let last = 0;
  let angle = 0;

  function render(timestamp) {
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.use();

    const delta = ((timestamp - last) / 1000) * glMatrix.toRadian(90);
    angle = (angle + delta) % 360;
    last = timestamp;

    // Create transformations
    const radius = 10;
    const x = Math.sin(timestamp * 0.001) * radius;
    const z = Math.cos(timestamp * 0.001) * radius;

    const view = mat4.create();
    mat4.lookAt(view, [x, 0, z], [0, 0, 0], [0, 1, 0]);

    const projection = mat4.create();
    mat4.perspective(projection, glMatrix.toRadian(45), 1, 0.1, 100);

    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uProjection, false, projection);

    gl.bindVertexArray(vao);
    for (let i = 0; i < cubes.length; i++) {
      const model = mat4.create();
      mat4.fromTranslation(model, cubes[i]);
      mat4.rotate(model, model, angle, [1, 0.3, 0.5]);

      gl.uniformMatrix4fv(uModel, false, model);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
