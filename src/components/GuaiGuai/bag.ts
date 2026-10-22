// A pillow-shaped snack bag in plain WebGL 1, no dependencies. Two sheets (front and back)
// meet at the edges; the body puffs out between flat crimped seals at the top and bottom.

const W = 2.05; // bag width
const H = 2.4; // bag height, seals included
const SEAL = 0.116; // seal height at top and bottom, matching the textures
const PUFF = 0.3; // half-thickness at the fullest point
const NX = 28;
const NY = 42;

type Mesh = { pos: Float32Array; nrm: Float32Array; uv: Float32Array; idx: Uint16Array };

function sheet(side: 1 | -1): Mesh {
  const cols = NX + 1;
  const rows = NY + 1;
  const P: number[][] = [];
  for (let j = 0; j < rows; j++) {
    const v = j / NY;
    const y = (0.5 - v) * H;
    const vb = Math.min(1, Math.max(0, (v * H - SEAL) / (H - 2 * SEAL)));
    const sv = Math.pow(Math.sin(Math.PI * vb), 0.6);
    for (let i = 0; i < cols; i++) {
      const u = i / NX;
      const su = Math.pow(Math.sin(Math.PI * u), 0.55);
      // A filled bag pulls its side edges in at mid-height, and crinkles near the seals.
      const x = (u - 0.5) * W * (1 - 0.07 * sv);
      const crinkle = 0.015 * Math.sin(u * 47 + side) * Math.exp(-Math.min(vb, 1 - vb) * 14) * su;
      const z = side * (PUFF * su * sv + crinkle + 0.006);
      P.push([x, y, z]);
    }
  }
  const pos = new Float32Array(cols * rows * 3);
  const nrm = new Float32Array(cols * rows * 3);
  const uv = new Float32Array(cols * rows * 2);
  const at = (i: number, j: number) =>
    P[Math.min(rows - 1, Math.max(0, j)) * cols + Math.min(cols - 1, Math.max(0, i))];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      const p = P[k];
      const du = sub(at(i + 1, j), at(i - 1, j));
      const dv = sub(at(i, j + 1), at(i, j - 1));
      // v runs downward, so dv x du points out of the front sheet.
      const n = side === 1 ? cross(dv, du) : cross(du, dv);
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      pos.set(p, k * 3);
      nrm.set([n[0] / len, n[1] / len, n[2] / len], k * 3);
      // The back texture is mirrored so it reads correctly from behind.
      uv.set([side === 1 ? i / NX : 1 - i / NX, j / NY], k * 2);
    }
  }
  const idx = new Uint16Array(NX * NY * 6);
  let o = 0;
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const a = j * cols + i;
      idx.set([a, a + cols, a + 1, a + 1, a + cols, a + cols + 1], o);
      o += 6;
    }
  }
  return { pos, nrm, uv, idx };
}

function sub(a: number[], b: number[]) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: number[], b: number[]) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// Column-major 4x4 helpers, just enough for one object and one camera.
function mul(a: Float32Array, b: Float32Array) {
  const r = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let rr = 0; rr < 4; rr++)
      r[c * 4 + rr] =
        a[rr] * b[c * 4] + a[4 + rr] * b[c * 4 + 1] + a[8 + rr] * b[c * 4 + 2] + a[12 + rr] * b[c * 4 + 3];
  return r;
}

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

function model(yaw: number, tilt: number, lift: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cz = Math.cos(tilt), sz = Math.sin(tilt);
  // Rz(tilt) * Ry(yaw), then translate up by lift.
  return new Float32Array([
    cz * cy, sz * cy, -sy, 0,
    -sz, cz, 0, 0,
    cz * sy, sz * sy, cy, 0,
    0, lift, 0, 1,
  ]);
}

const VS = `
attribute vec3 aPos;
attribute vec3 aNrm;
attribute vec2 aUv;
uniform mat4 uModel;
uniform mat4 uViewProj;
varying vec3 vNrm;
varying vec3 vPos;
varying vec2 vUv;
void main() {
  vec4 w = uModel * vec4(aPos, 1.0);
  vPos = w.xyz;
  vNrm = mat3(uModel[0].xyz, uModel[1].xyz, uModel[2].xyz) * aNrm;
  vUv = aUv;
  gl_Position = uViewProj * w;
}`;

const FS = `
precision mediump float;
uniform sampler2D uTex;
uniform vec3 uEye;
uniform float uTime;
varying vec3 vNrm;
varying vec3 vPos;
varying vec2 vUv;
void main() {
  vec3 base = texture2D(uTex, vUv).rgb;
  vec3 N = normalize(vNrm);
  vec3 V = normalize(uEye - vPos);
  if (dot(N, V) < 0.0) N = -N;
  vec3 L1 = normalize(vec3(-0.5, 0.8, 0.9));
  vec3 L2 = normalize(vec3(0.9, -0.2, 0.4));
  float diff = max(dot(N, L1), 0.0) * 0.75 + max(dot(N, L2), 0.0) * 0.25;
  vec3 Hv = normalize(L1 + V);
  float spec = pow(max(dot(N, Hv), 0.0), 48.0) * 0.3;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  // A glint that sweeps across the plastic every few seconds.
  float band = vUv.x + vUv.y * 0.35 - mod(uTime * 0.35, 3.0) + 0.6;
  float glint = smoothstep(0.0, 0.06, band) * (1.0 - smoothstep(0.06, 0.14, band)) * 0.25;
  // The textures are photos with their own lighting, so shading only modulates them gently.
  vec3 col = base * (0.62 + 0.5 * diff) + vec3(spec + glint) + rim * vec3(1.0, 0.82, 0.35) * 0.45;
  gl_FragColor = vec4(col, 1.0);
}`;

export type BagHandle = { stop: () => void };

export function startBag(
  canvas: HTMLCanvasElement,
  frontUrl: string,
  backUrl: string,
): BagHandle | null {
  const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;

  const prog = link(gl, VS, FS);
  if (!prog) return null;
  gl.useProgram(prog);
  const loc = {
    pos: gl.getAttribLocation(prog, "aPos"),
    nrm: gl.getAttribLocation(prog, "aNrm"),
    uv: gl.getAttribLocation(prog, "aUv"),
    model: gl.getUniformLocation(prog, "uModel"),
    viewProj: gl.getUniformLocation(prog, "uViewProj"),
    eye: gl.getUniformLocation(prog, "uEye"),
    time: gl.getUniformLocation(prog, "uTime"),
  };

  const sheets = ([1, -1] as const).map((side) => upload(gl, sheet(side)));
  const textures = [texture(gl, frontUrl, [31, 158, 69]), texture(gl, backUrl, [31, 158, 69])];

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const eye = [0, 0.15, 6];
  let yaw = -0.5;
  let spin = reduced ? 0.12 : 0.45; // radians per second
  let dragging = false;
  let lastX = 0;
  let last = performance.now();
  let raf = 0;
  let visible = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    if (!dragging) {
      const base = reduced ? 0.12 : 0.45;
      spin += (base - spin) * Math.min(1, dt * 1.5);
      yaw += spin * dt;
    }
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = canvas.width / Math.max(1, canvas.height);
    // Frame the bag's height plus bob, and its width on narrow screens.
    const halfH = Math.max(1.85, 1.35 / aspect);
    const fov = 2 * Math.atan(halfH / eye[2]);
    const proj = perspective(fov, aspect, 0.1, 50);
    const view = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -eye[0], -eye[1], -eye[2], 1]);
    const bob = reduced ? 0 : Math.sin(t * 1.6) * 0.08;
    const tilt = reduced ? 0 : Math.sin(t * 0.9) * 0.05;
    gl.uniformMatrix4fv(loc.viewProj, false, mul(proj, view));
    gl.uniformMatrix4fv(loc.model, false, model(yaw, tilt, bob));
    gl.uniform3fv(loc.eye, eye);
    gl.uniform1f(loc.time, t);

    sheets.forEach((s, k) => {
      gl.bindTexture(gl.TEXTURE_2D, textures[k]);
      bind(gl, s.pos, loc.pos, 3);
      bind(gl, s.nrm, loc.nrm, 3);
      bind(gl, s.uv, loc.uv, 2);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, s.idx);
      gl.drawElements(gl.TRIANGLES, s.count, gl.UNSIGNED_SHORT, 0);
    });
    if (visible) raf = requestAnimationFrame(frame);
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    yaw += dx * 0.01;
    spin = dx * 0.6;
  };
  const onUp = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  io.observe(canvas);
  raf = requestAnimationFrame(frame);

  return {
    stop() {
      visible = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    },
  };
}

function link(gl: WebGLRenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram();
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const sh = gl.createShader(type);
    if (!sh || !prog) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

function upload(gl: WebGLRenderingContext, m: Mesh) {
  const buf = (data: Float32Array) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };
  const idx = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW);
  return { pos: buf(m.pos), nrm: buf(m.nrm), uv: buf(m.uv), idx, count: m.idx.length };
}

function bind(gl: WebGLRenderingContext, b: WebGLBuffer | null, loc: number, size: number) {
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}

// Starts as a single bag-green texel so the bag draws before the JPEG arrives.
function texture(gl: WebGLRenderingContext, url: string, rgb: number[]) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(rgb));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    // The JPEGs are square powers of two, so WebGL 1 can mipmap them.
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    // Keeps the sticker text sharp when the bag turns edge-on.
    const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4);
  };
  img.src = url;
  return tex;
}
