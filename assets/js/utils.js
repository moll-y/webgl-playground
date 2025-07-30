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
