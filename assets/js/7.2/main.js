import vshader from "@glsl/7.2/shader.vert";
import fshader from "@glsl/7.2/shader.frag";
import { getWebGL2RenderingContext, loadTexture } from "@/utils";
import { Shader } from "@/shader";
import { glMatrix, mat4, vec3 } from "gl-matrix";

function main() {
  const gl = getWebGL2RenderingContext("7.2");
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

  const cameraPosition = vec3.fromValues(0, 0, 3);
  const cameraFront = vec3.fromValues(0, 0, -1);
  const cameraUp = vec3.fromValues(0, 1, 0);

  let deltaTime = 0;
  let lastFrame = 0;

  document.onkeydown = function (event) {
    if (event.defaultPrevented) {
      return;
    }

    const speed = 20 * deltaTime;

    switch (event.code) {
      case "KeyW":
        vec3.add(
          cameraPosition,
          cameraPosition,
          vec3.scale(vec3.create(), cameraFront, speed),
        );
        break;

      case "KeyS":
        vec3.sub(
          cameraPosition,
          cameraPosition,
          vec3.scale(vec3.create(), cameraFront, speed),
        );
        break;

      case "KeyA":
        vec3.sub(
          cameraPosition,
          cameraPosition,
          vec3.scale(
            vec3.create(),
            vec3.normalize(
              vec3.create(),
              vec3.cross(vec3.create(), cameraFront, cameraUp),
            ),
            speed,
          ),
        );
        break;

      case "KeyD":
        vec3.add(
          cameraPosition,
          cameraPosition,
          vec3.scale(
            vec3.create(),
            vec3.normalize(
              vec3.create(),
              vec3.cross(vec3.create(), cameraFront, cameraUp),
            ),
            speed,
          ),
        );
        break;

      default:
        break;
    }
  };

  function render(timestamp) {
    deltaTime = timestamp * 0.001 - lastFrame;
    lastFrame = timestamp * 0.001;

    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.use();

    // Create transformations
    const view = mat4.create();
    mat4.lookAt(
      view,
      cameraPosition,
      vec3.add(vec3.create(), cameraPosition, cameraFront),
      cameraUp,
    );

    const projection = mat4.create();
    mat4.perspective(projection, glMatrix.toRadian(45), 1, 0.1, 100);

    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uProjection, false, projection);

    gl.bindVertexArray(vao);
    for (let i = 0; i < cubes.length; i++) {
      const model = mat4.create();
      mat4.fromTranslation(model, cubes[i]);
      mat4.rotate(model, model, glMatrix.toRadian(50), [1, 0.3, 0.5]);

      gl.uniformMatrix4fv(uModel, false, model);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
