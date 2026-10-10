// The Hi page's hero in one WebGL2 pass: the night sky, the name, and a soft
// lens through which the film shows. Inside the lens: a wide haze of blurred
// film, a softer wash, sharp film within the letters, and a ring at its edge
// that blurs whatever it passes. Every blur is a mipmap lookup, so the whole
// effect costs a few texture reads per pixel instead of a filter pass.

const vertex = `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const fragment = `#version 300 es
precision highp float;
uniform sampler2D uSkyA, uSkyB, uVideo, uText;
uniform float uMix, uT, uStretch, uOn;
uniform vec2 uRes, uSkyCover, uVidCover;
uniform vec4 uTextRect;
uniform vec3 uLens;
in vec2 vUv;
out vec4 outColor;

vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }

// Three soft ellipses drifting around the lens centre: an organic, slowly
// changing edge. uStretch elongates it vertically while a phone scrolls.
float blob(vec2 p, float R) {
  vec2 s = vec2(inversesqrt(uStretch), uStretch);
  vec2 c = uLens.xy;
  float a = uT;
  float m1 = 1.0 - smoothstep(0.25, 1.0, length((p - c - R * vec2(0.18 * cos(a), 0.12 * sin(a * 1.2))) / (R * vec2(1.1, 0.85) * s)));
  float m2 = 1.0 - smoothstep(0.20, 1.0, length((p - c - R * vec2(-0.22 * sin(a * 1.3), 0.15 * cos(a * 0.9))) / (R * vec2(0.8, 1.0) * s)));
  float m3 = 1.0 - smoothstep(0.30, 1.0, length((p - c - R * vec2(0.12 * sin(a * 0.7), -0.2 * cos(a * 1.1))) / (R * vec2(0.75) * s)));
  return clamp(m1 + m2 + m3, 0.0, 1.0);
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes; // CSS pixels from the top left
  vec2 skyUv = cover(vUv, uSkyCover);
  vec2 textUv = (px - uTextRect.xy) / uTextRect.zw;
  textUv.y = 1.0 - textUv.y;

  // Darker around the name and at the top and bottom edges, as the page was.
  vec2 q = (vUv - 0.5) / vec2(0.7, 0.55);
  float shade = (1.0 - 0.35 * (1.0 - smoothstep(0.0, 1.0, length(q))))
    * mix(0.55, 1.0, 1.0 - smoothstep(0.8, 1.0, vUv.y)) * mix(0.4, 1.0, smoothstep(0.0, 0.25, vUv.y)) * 1.35;

  float ringD = length(px - uLens.xy) / (uLens.z * 1.5);
  float ring = uOn * smoothstep(0.30, 0.62, ringD) * (1.0 - smoothstep(0.62, 1.0, ringD));

  vec3 sky = mix(texture(uSkyA, skyUv).rgb, texture(uSkyB, skyUv).rgb, uMix) * shade;
  vec3 skySoft = mix(texture(uSkyA, skyUv, 3.0).rgb, texture(uSkyB, skyUv, 3.0).rgb, uMix) * shade;
  float text = texture(uText, textUv).a;
  float textSoft = texture(uText, textUv, 3.0).a;
  vec3 color = mix(mix(sky, vec3(1.0), text), mix(skySoft, vec3(1.0), textSoft), ring);

  if (uOn > 0.0) {
    vec2 vidUv = cover(vUv, uVidCover);
    float haze = blob(px, uLens.z * 1.7) * uOn;
    float lens = blob(px, uLens.z) * uOn;
    color = mix(color, texture(uVideo, vidUv, 5.0).rgb, 0.55 * haze);
    color = mix(color, texture(uVideo, vidUv, 1.5).rgb, 0.6 * lens);
    color = mix(color, texture(uVideo, vidUv).rgb, text * lens);
  }
  outColor = vec4(color, 1.0);
}`

export interface LensState {
  mix: number // between sky frames A and B
  lens: { x: number, y: number, r: number } // CSS pixels
  stretch: number // 1 = round
  t: number // seconds; drives the blob's drift
  on: number // 0–1: fades the lens in once the film is ready
}

export function createLens(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
  if (!gl) return null

  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, source)
    gl.compileShader(s)
    return s
  }
  const program = gl.createProgram()!
  gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex))
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const u = (name: string) => gl.getUniformLocation(program, name)
  const uniforms = Object.fromEntries(['uMix', 'uT', 'uStretch', 'uOn', 'uRes', 'uSkyCover', 'uVidCover', 'uTextRect', 'uLens']
    .map(name => [name, u(name)]))

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  const textures = ['uSkyA', 'uSkyB', 'uVideo', 'uText'].map((name, unit) => {
    const tex = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
    gl.uniform1i(u(name), unit)
    return tex
  })
  const upload = (unit: number, source: TexImageSource) => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, textures[unit])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  let width = 1
  let height = 1
  let sky: [HTMLImageElement | null, HTMLImageElement | null] = [null, null]
  let skyAspect = 1.5
  let videoAspect = 16 / 9

  // object-fit: cover, as a scale on texture coordinates.
  const coverScale = (aspect: number): [number, number] => {
    const screen = width / height
    return screen > aspect ? [1, aspect / screen] : [screen / aspect, 1]
  }

  return {
    resize(w: number, h: number, dpr: number) {
      width = w
      height = h
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    },
    // Uploads only what changed; stepping one frame forward reuses B as A.
    setSky(a: HTMLImageElement, b: HTMLImageElement) {
      if (sky[0] === a && sky[1] === b) return
      if (sky[1] === a) {
        textures.splice(0, 2, textures[1], textures[0])
        for (const unit of [0, 1]) {
          gl.activeTexture(gl.TEXTURE0 + unit)
          gl.bindTexture(gl.TEXTURE_2D, textures[unit])
        }
        sky = [a, sky[0]]
      }
      if (sky[0] !== a) upload(0, a)
      if (sky[1] !== b) upload(1, b)
      sky = [a, b]
      skyAspect = a.naturalWidth / a.naturalHeight
    },
    setText(source: HTMLCanvasElement, rect: [number, number, number, number]) {
      upload(3, source)
      gl.uniform4f(uniforms.uTextRect, ...rect)
    },
    setVideoFrame(video: HTMLVideoElement) {
      upload(2, video)
      videoAspect = video.videoWidth / video.videoHeight
    },
    render(s: LensState) {
      gl.uniform1f(uniforms.uMix, s.mix)
      gl.uniform1f(uniforms.uT, s.t)
      gl.uniform1f(uniforms.uStretch, s.stretch)
      gl.uniform1f(uniforms.uOn, s.on)
      gl.uniform2f(uniforms.uRes, width, height)
      gl.uniform2f(uniforms.uSkyCover, ...coverScale(skyAspect))
      gl.uniform2f(uniforms.uVidCover, ...coverScale(videoAspect))
      gl.uniform3f(uniforms.uLens, s.lens.x, s.lens.y, s.lens.r)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    dispose() {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
