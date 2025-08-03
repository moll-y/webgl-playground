/**
 * Retrieves the WebGL2 rendering context from a canvas element.
 *
 * @param {string} The canvas element id.
 * @returns {WebGL2RenderingContext} The WebGL2 context associated with the canvas.
 * @throws {Error} If the canvas is not found or if WebGL2 is not supported.
 */
export function getWebGL2RenderingContext(elementId) {
  const canvas = document.getElementById(elementId);
  if (canvas === null) {
    throw new Error("No matching element was found in the document.");
  }
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    throw new Error(
      "Context identifier is not supported, or the canvas has already been set to a different context mode.",
    );
  }
  return gl;
}

export function getWebGLRenderingContext(elementId) {
  const canvas = document.getElementById(elementId);
  if (canvas === null) {
    throw new Error("No matching element was found in the document.");
  }
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    throw new Error(
      "Context identifier is not supported, or the canvas has already been set to a different context mode.",
    );
  }
  return [gl, canvas];
}

/**
 * Compiles a shader of the given type (vertex or fragment) using the provided
 * source code.
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context to use.
 * @param {string} source - The GLSL source code for the shader.
 * @param {number} type - The type of shader, either `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.
 * @returns {WebGLShader} The compiled shader object.
 * @throws {Error} If shader compilation fails.
 */
export function compileShader(gl, source, type) {
  if (type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
    throw new Error(
      "The type of shader should be either `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.",
    );
  }
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Could not compile WebGL shader: ${info}`);
  }
  return shader;
}

/**
 * Creates and links a WebGL program using the provided shaders.
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context to use.
 * @param {...WebGLShader} shaders - One or more compiled shaders to attach.
 * @returns {WebGLProgram} The linked WebGL program.
 * @throws {Error} If program linking fails.
 */
export function createAndLinkProgram(gl, ...shaders) {
  const program = gl.createProgram();
  for (const shader of shaders) {
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link WebGL program: ${info}`);
  }
  for (const shader of shaders) {
    gl.deleteShader(shader);
  }
  return program;
}

export function loadTexture(gl, textureUnit, index, path, shader, location) {
  const texture = gl.createTexture();
  gl.activeTexture(textureUnit);
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
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]),
  );

  const image = new Image();
  image.onload = function () {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    shader.use();
    gl.uniform1i(location, index);
  };
  image.src = path;
}
