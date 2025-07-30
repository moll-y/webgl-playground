export class Shader {
  constructor(gl, vshaderSource, fshaderSource) {
    const vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vshaderSource);
    gl.compileShader(vshader);
    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(vshader);
      gl.deleteShader(vshader);
      throw new Error(`Could not compile vertex shader: ${info}`);
    }

    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fshaderSource);
    gl.compileShader(fshader);
    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fshader);
      gl.deleteShader(fshader);
      throw new Error(`Could not compile fragment shader: ${info}`);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Could not link shader's program: ${info}`);
    }
    gl.deleteShader(vshader);
    gl.deleteShader(fshader);

    this.program = program;
    this.gl = gl;
  }

  use() {
    this.gl.useProgram(this.program);
  }
}
