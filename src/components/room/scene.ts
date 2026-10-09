import * as THREE from 'three'
import wallUrl from '../../assets/room/wall.jpg'
import wallNormalUrl from '../../assets/room/wall-normal.jpg'

export interface RoomPhoto {
  url: string
  thumbnail: string
  w: number
  h: number
  Tags: string[]
  Camera?: string
  DateTime?: number
}

// Metres. One framed photo on a paper wall under a single spotlight, like the Unity original.
const FRAME_Y = 1.6
const PHOTO_LONG = 1.0
const MAT = 0.14
const MOULD = 0.05
const DEPTH = 0.045
const QUOTE = '“Shams, my body is a candle touched with fire”'
const QUOTE_BY = 'RUMI, NIGHT AND SLEEP'

export function createRoom(container: HTMLElement, { mobile, developing }: { mobile: boolean, developing: string }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  // Variance shadow maps give the soft, blurred edge of real sunlight.
  renderer.shadowMap.type = THREE.VSMShadowMap
  container.append(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050403)
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
  const textureCap = Math.min(renderer.capabilities.maxTextureSize, mobile ? 2048 : 4096)

  // Wall and floor
  const loader = new THREE.TextureLoader()
  const wallMap = loader.load(wallUrl)
  wallMap.colorSpace = THREE.SRGBColorSpace
  wallMap.anisotropy = maxAnisotropy
  const wallNormal = loader.load(wallNormalUrl)
  wallNormal.wrapS = wallNormal.wrapT = THREE.RepeatWrapping
  wallNormal.repeat.set(2, 1.33)
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 6.67),
    new THREE.MeshStandardMaterial({ map: wallMap, normalMap: wallNormal, normalScale: new THREE.Vector2(0.18, 0.18), roughness: 0.95 }),
  )
  wall.position.set(0, 3.2, 0)
  wall.receiveShadow = true
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x15110d, roughness: 0.85 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, 5)
  floor.receiveShadow = true
  scene.add(wall, floor)

  // Light, after the Unity scene: a far-off "sun" spot (25° cone, 18° inner)
  // slanting across the wall like sunlight through a window, a soft fill, and
  // a cool ambient sky. Near-neutral daylight so photos keep their colour.
  const SUN = new THREE.Vector3(-7, 9, 9)
  const sun = new THREE.SpotLight(0xfff3e4, 950, 0, THREE.MathUtils.degToRad(12.7), 0.28, 2)
  sun.position.copy(SUN)
  sun.target.position.set(0.3, FRAME_Y - 0.1, 0)
  sun.castShadow = true
  sun.shadow.mapSize.setScalar(mobile ? 1024 : 2048)
  sun.shadow.camera.near = 8
  sun.shadow.camera.far = 22
  sun.shadow.bias = -0.0003
  sun.shadow.radius = mobile ? 4 : 8
  sun.shadow.blurSamples = mobile ? 12 : 24 // enough samples for the radius to avoid banding
  const fill = new THREE.DirectionalLight(0xfff6ec, 0.35)
  fill.position.set(-3, 4, 6)
  const sky = new THREE.HemisphereLight(0x3a3d42, 0x0c0b0a, 1)
  scene.add(sun, sun.target, fill, sky)

  // Dust in the sunbeam, after Unity's "Big Dust": ~150 soft grey motes at a
  // time, each living 5 s and drifting ~0.1 m/s, only where the beam is.
  const DUST = mobile ? 90 : 160
  const LIFE = 5
  const beamAxis = new THREE.Vector3()
  const toPoint = new THREE.Vector3()
  const cosHalf = Math.cos(sun.angle)
  const inBeam = (p: THREE.Vector3) => {
    beamAxis.subVectors(sun.target.position, sun.position).normalize()
    toPoint.subVectors(p, sun.position).normalize()
    return beamAxis.dot(toPoint) > cosHalf
  }
  const dustPositions = new Float32Array(DUST * 3)
  const dustAge = new Float32Array(DUST)
  const dustDrift = new Float32Array(DUST * 3)
  const spawn = (i: number, age: number) => {
    const p = new THREE.Vector3()
    do p.set((Math.random() - 0.5) * 4.4, 0.4 + Math.random() * 2.8, 0.15 + Math.random() * 2.4)
    while (!inBeam(p))
    p.toArray(dustPositions, i * 3)
    dustAge[i] = age
    dustDrift.set([(Math.random() - 0.5) * 0.1, (Math.random() - 0.3) * 0.06, (Math.random() - 0.5) * 0.1], i * 3)
  }
  for (let i = 0; i < DUST; i++) spawn(i, Math.random() * LIFE)
  const dustGeometry = new THREE.BufferGeometry()
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  dustGeometry.setAttribute('age', new THREE.BufferAttribute(dustAge, 1))
  const dust = new THREE.Points(dustGeometry, new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0xd9d4cc) }, uScale: { value: renderer.getPixelRatio() } },
    vertexShader: `
      attribute float age;
      uniform float uScale;
      varying float vFade;
      void main() {
        vFade = sin(clamp(age / ${LIFE.toFixed(1)}, 0.0, 1.0) * 3.14159);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 9.0 * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vFade;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * 0.48 * vFade);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }))
  scene.add(dust)

  // Frame: moulding, mat and photo. The photo material "develops" from blank
  // paper (uDevelop = 0) to the full image (1).
  const develop = { value: 0 }
  let developTarget = 0
  const placeholder = new THREE.DataTexture(new Uint8Array([240, 236, 228, 255]), 1, 1)
  placeholder.needsUpdate = true
  const photoMat = new THREE.MeshStandardMaterial({ map: placeholder, roughness: 0.55 })
  photoMat.onBeforeCompile = shader => {
    shader.uniforms.uDevelop = develop
    shader.fragmentShader = 'uniform float uDevelop;\n' + shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      float grey = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
      vec3 paper = mix(vec3(0.93, 0.91, 0.87), vec3(grey), 0.3);
      diffuseColor.rgb = mix(paper, diffuseColor.rgb, smoothstep(0.0, 1.0, uDevelop));`)
  }
  const mouldMat = new THREE.MeshStandardMaterial({ color: 0x17130f, roughness: 0.5, metalness: 0.1 })
  const matMat = new THREE.MeshStandardMaterial({ color: 0xe4ded2, roughness: 0.95 })
  const frame = new THREE.Group()
  frame.position.set(0, FRAME_Y, 0)
  scene.add(frame)
  let outer = { w: 1, h: 1 }

  const buildFrame = (ar: number) => {
    frame.children.forEach(child => (child as THREE.Mesh).geometry.dispose())
    frame.clear()
    const pw = ar >= 1 ? PHOTO_LONG * 1.1 : PHOTO_LONG * ar
    const ph = ar >= 1 ? PHOTO_LONG * 1.1 / ar : PHOTO_LONG
    const iw = pw + MAT * 2
    const ih = ph + MAT * 2
    outer = { w: iw + MOULD * 2, h: ih + MOULD * 2 }
    // Only the moulding casts a shadow (onto the wall); the flush mat and photo
    // don't need one, and skipping them avoids edge artifacts.
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.castShadow = material === mouldMat
      frame.add(mesh)
    }
    add(new THREE.BoxGeometry(outer.w, MOULD, DEPTH), mouldMat, 0, (ih + MOULD) / 2, DEPTH / 2)
    add(new THREE.BoxGeometry(outer.w, MOULD, DEPTH), mouldMat, 0, -(ih + MOULD) / 2, DEPTH / 2)
    add(new THREE.BoxGeometry(MOULD, ih, DEPTH), mouldMat, -(iw + MOULD) / 2, 0, DEPTH / 2)
    add(new THREE.BoxGeometry(MOULD, ih, DEPTH), mouldMat, (iw + MOULD) / 2, 0, DEPTH / 2)
    add(new THREE.BoxGeometry(iw, ih, 0.01), matMat, 0, 0, 0.005)
    add(new THREE.PlaneGeometry(pw, ph), photoMat, 0, 0, 0.0105)
  }

  // Wall text: the Rumi quote as vinyl lettering, and a museum label.
  // depth > 0 makes a card that stands off the wall; 0 is lettering on it.
  const textPlane = (canvas: HTMLCanvasElement, width: number, depth: number) => {
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = maxAnisotropy
    const height = width * canvas.height / canvas.width
    const face = new THREE.MeshStandardMaterial({ map: texture, transparent: !depth, roughness: depth ? 0.85 : 1 })
    const mesh = depth
      ? new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [
        ...Array(4).fill(new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.85 })), face, face])
      : new THREE.Mesh(new THREE.PlaneGeometry(width, height), face)
    scene.add(mesh)
    return { mesh, texture }
  }

  const quoteCanvas = document.createElement('canvas')
  quoteCanvas.width = 1400
  quoteCanvas.height = 560
  const quote = textPlane(quoteCanvas, 1.05, 0)
  const drawQuote = () => {
    const ctx = quoteCanvas.getContext('2d')!
    ctx.clearRect(0, 0, quoteCanvas.width, quoteCanvas.height)
    ctx.fillStyle = 'rgba(44, 36, 28, 0.85)'
    ctx.font = '300 84px "Helvetica Neue", Helvetica, Arial, sans-serif'
    const words = QUOTE.split(' ')
    let line = ''
    let y = 110
    for (const word of words) {
      if (ctx.measureText(line + word).width > 1300 && line) {
        ctx.fillText(line.trim(), 20, y)
        line = ''
        y += 104
      }
      line += word + ' '
    }
    ctx.fillText(line.trim(), 20, y)
    ctx.font = '400 34px "Helvetica Neue", Helvetica, Arial, sans-serif'
    ctx.letterSpacing = '4px'
    ctx.fillText(QUOTE_BY, 22, y + 80)
    quote.texture.needsUpdate = true
  }

  const labelCanvas = document.createElement('canvas')
  labelCanvas.width = 720
  labelCanvas.height = 400
  const label = textPlane(labelCanvas, 0.34, 0.008)
  let labelInfo: { photo: RoomPhoto, index: number, total: number } | null = null
  let labelProgress: number | null = null
  const drawLabel = () => {
    if (!labelInfo) return
    const { photo, index, total } = labelInfo
    const ctx = labelCanvas.getContext('2d')!
    ctx.fillStyle = '#F6F3EC'
    ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height)
    ctx.fillStyle = '#1A1A1A'
    ctx.font = '700 54px "Helvetica Neue", Helvetica, Arial, sans-serif'
    ctx.fillText(photo.Tags.join(' · ') || '—', 44, 100)
    ctx.fillStyle = '#4A4A4A'
    ctx.font = '400 42px "Helvetica Neue", Helvetica, Arial, sans-serif'
    const year = photo.DateTime ? new Date(photo.DateTime * 1000).getFullYear() : ''
    ctx.fillText([photo.Camera, year].filter(Boolean).join(' · '), 44, 170)
    ctx.fillStyle = '#7A7A7A'
    ctx.font = '400 30px "Helvetica Neue", Helvetica, Arial, sans-serif'
    if (labelProgress === null) {
      ctx.fillText(`No. ${index + 1} / ${total.toLocaleString()}`, 44, 340)
    } else {
      ctx.fillText(developing, 44, 312)
      ctx.fillStyle = '#D8D3C8'
      ctx.fillRect(44, 336, 632, 6)
      ctx.fillStyle = '#1A1A1A'
      ctx.fillRect(44, 336, 632 * labelProgress, 6)
    }
    label.texture.needsUpdate = true
  }

  // Layout and camera: frame the photo with room around it; portrait screens
  // put the quote above and the label below instead of beside.
  let aspect = 1
  let baseDistance = 4
  let zoomed = false
  const pointer = new THREE.Vector2()
  const placeAround = () => {
    const portrait = aspect < 1
    camera.fov = portrait ? 50 : 38
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    if (portrait) {
      quote.mesh.position.set(0, FRAME_Y + outer.h / 2 + 0.4, 0.002)
      label.mesh.position.set(0, FRAME_Y - outer.h / 2 - 0.22, 0.004)
    } else {
      quote.mesh.position.set(-outer.w / 2 - 0.9, FRAME_Y + 0.3, 0.002)
      label.mesh.position.set(outer.w / 2 + 0.42, FRAME_Y - outer.h / 2 + 0.22, 0.004)
    }
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const halfW = portrait ? outer.w / 2 + 0.25 : outer.w / 2 + 1.55
    const halfH = outer.h / 2 + (portrait ? 0.8 : 0.45)
    baseDistance = Math.max(halfH / tan, halfW / (tan * aspect))
  }

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container
    if (!w || !h) return
    renderer.setSize(w, h)
    aspect = w / h
    placeAround()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(container)

  // Render loop: the camera eases toward where the "visitor" is standing.
  const clock = new THREE.Clock()
  const eye = new THREE.Vector3(0, FRAME_Y, 4)
  const look = new THREE.Vector3(0, FRAME_Y, 0)
  const eyeTarget = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.1)
    const t = clock.elapsedTime
    const ease = 1 - Math.exp(-dt * 3)
    const reach = zoomed ? 0.35 : 1
    const distance = baseDistance * (zoomed ? 0.55 : 1)
    const sway = still ? 0 : Math.sin(t * 0.8) * 0.008
    eye.lerp(eyeTarget.set(pointer.x * 0.75 * reach, FRAME_Y + 0.04 + pointer.y * 0.22 * reach + sway, distance), ease)
    look.lerp(lookTarget.set(pointer.x * 0.2 * reach, FRAME_Y + pointer.y * 0.08 * reach, 0), ease)
    camera.position.copy(eye)
    camera.lookAt(look)
    develop.value += (developTarget - develop.value) * (1 - Math.exp(-dt * 4))
    for (let i = 0; i < DUST; i++) {
      dustAge[i] += dt
      if (dustAge[i] > LIFE) spawn(i, 0)
      else for (let k = 0; k < 3; k++) dustPositions[i * 3 + k] += dustDrift[i * 3 + k] * dt
    }
    dustGeometry.attributes.position.needsUpdate = true
    dustGeometry.attributes.age.needsUpdate = true
    // The sun drifts a little, as if time passes.
    if (!still) sun.position.set(SUN.x + Math.sin(t / 20) * 0.8, SUN.y + Math.sin(t / 27) * 0.4, SUN.z)
    renderer.render(scene, camera)
  })

  document.fonts.load('300 40px "Helvetica Neue"').finally(drawQuote)

  // Photos: the thumbnail shows at once; the full-resolution file then
  // downloads, the print develops with its progress, and the sharp version
  // takes over. Skipped photos cancel their downloads.
  let token = 0
  let pending: AbortController | null = null
  let fullTimer = 0

  const setPhoto = (texture: THREE.Texture) => {
    const old = photoMat.map
    photoMat.map = texture
    if (old && old !== placeholder) old.dispose()
  }

  const fromImage = (image: HTMLImageElement) => {
    const scale = Math.min(1, textureCap / Math.max(image.naturalWidth, image.naturalHeight))
    let source: HTMLImageElement | HTMLCanvasElement = image
    if (scale < 1) {
      source = document.createElement('canvas')
      source.width = Math.round(image.naturalWidth * scale)
      source.height = Math.round(image.naturalHeight * scale)
      source.getContext('2d')!.drawImage(image, 0, 0, source.width, source.height)
    }
    const texture = new THREE.Texture(source)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = maxAnisotropy
    texture.needsUpdate = true
    return texture
  }

  const loadImage = async (src: string) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    await image.decode()
    return image
  }

  const download = async (url: string, signal: AbortSignal, onProgress: (p: number) => void) => {
    const res = await fetch(url, { signal })
    const total = Number(res.headers.get('content-length'))
    if (!res.ok || !res.body || !total) return res.blob()
    const reader = res.body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      onProgress(received / total)
    }
    return new Blob(chunks as BlobPart[])
  }

  const show = async (photo: RoomPhoto, index: number, total: number) => {
    const mine = ++token
    pending?.abort()
    clearTimeout(fullTimer)
    buildFrame(photo.w / photo.h)
    placeAround()
    labelInfo = { photo, index, total }
    labelProgress = 0
    drawLabel()
    develop.value = 0.05
    developTarget = 0.35
    try {
      const thumb = fromImage(await loadImage(photo.thumbnail))
      if (mine !== token) return thumb.dispose()
      setPhoto(thumb)
    } catch {
      // keep the blank print until the full photo arrives
    }
    // Wait a beat so holding an arrow key doesn't start a download per photo.
    fullTimer = window.setTimeout(async () => {
      pending = new AbortController()
      let shown = 0
      try {
        const blob = await download(photo.url, pending.signal, p => {
          developTarget = 0.35 + 0.5 * p
          if (p - shown > 0.02) {
            shown = p
            labelProgress = p
            drawLabel()
          }
        })
        const url = URL.createObjectURL(blob)
        const image = await loadImage(url).finally(() => URL.revokeObjectURL(url))
        if (mine !== token) return
        setPhoto(fromImage(image))
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
      }
      if (mine !== token) return
      developTarget = 1
      labelProgress = null
      drawLabel()
    }, 180)
  }

  return {
    show,
    setZoom: (on: boolean) => (zoomed = on),
    // x, y in -1…1 relative to the stage centre
    setPointer: (x: number, y: number) => pointer.set(x, y),
    dispose: () => {
      token++
      pending?.abort()
      clearTimeout(fullTimer)
      observer.disconnect()
      renderer.setAnimationLoop(null)
      scene.traverse(object => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
        materials.forEach(material => {
          (material as THREE.MeshStandardMaterial).map?.dispose()
          material.dispose()
        })
      })
      wallNormal.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
