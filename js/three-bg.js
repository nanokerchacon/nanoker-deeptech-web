import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const GLOBAL_BG_KEY = "__NK_THREE_BG__";
const THREE_ACTIVE_CLASS = "has-three";
const THREE_FALLBACK_CLASS = "no-three";
const VIEWPORT_HEIGHT_VAR = "--app-height";
const THREE_ROOT_ID = "three-bg-root";
const THREE_DEBUG_STYLE_ID = "three-bg-debug-style";
const THREE_DEBUG_PANEL_ID = "three-bg-debug-panel";
const THREE_DEBUG_OVERLAY_ID = "three-bg-debug-overlay";

function syncThreeBodyState(isActive) {
  if (!document.body) return;
  document.body.classList.toggle(THREE_ACTIVE_CLASS, isActive);
  document.body.classList.toggle(THREE_FALLBACK_CLASS, !isActive);
}

function setViewportHeightVar(height) {
  if (!document.documentElement || !Number.isFinite(height) || height <= 0) return;
  document.documentElement.style.setProperty(VIEWPORT_HEIGHT_VAR, `${height * 0.01}px`);
}

function getThreeDebugFlags() {
  const params = new URLSearchParams(window.location.search);
  return {
    enabled: params.get("threeDebug") === "1",
    force: params.get("threeForce") === "1",
    staticScene: params.get("threeDebugStatic") === "1",
    noAnim: params.get("threeNoAnim") === "1",
    opaque: params.get("threeOpaque") === "1",
  };
}

export function initThreeBackground(options = {}) {
  const existing = window[GLOBAL_BG_KEY];
  if (existing && !existing.isDisposed?.()) {
    existing.ensureCanvasMounted?.();
    existing.refresh?.();
    existing.resume?.();
    return existing;
  }

  const STATES = {
    hero: {
      color: new THREE.Color(0x0b1016),
      emissive: new THREE.Color(0x05070a),
      roughness: 0.22,
      metalness: 0.85,
      waveType: 0,
      freq: 0.2,
      amp: 1.0,
      bloom: 0.22,
      particles: 0.08,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    base: {
      color: new THREE.Color(0x080b10),
      emissive: new THREE.Color(0x030507),
      roughness: 0.28,
      metalness: 0.82,
      waveType: 0,
      freq: 0.2,
      amp: 1.0,
      bloom: 0.18,
      particles: 0.06,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    quantum: {
      color: new THREE.Color(0x220011),
      emissive: new THREE.Color(0xff0055),
      roughness: 0.0,
      metalness: 0.8,
      waveType: 1,
      freq: 2.0,
      amp: 0.5,
      bloom: 0.6,
      particles: 0.18,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    semi: {
      color: new THREE.Color(0x001133),
      emissive: new THREE.Color(0x00ffff),
      roughness: 0.2,
      metalness: 0.9,
      waveType: 2,
      freq: 0.8,
      amp: 0.4,
      bloom: 0.62,
      particles: 0.22,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    capabilities: {
      color: new THREE.Color(0x031423),
      emissive: new THREE.Color(0x48d9ff),
      roughness: 0.18,
      metalness: 0.9,
      waveType: 2,
      freq: 0.95,
      amp: 0.42,
      bloom: 0.66,
      particles: 0.24,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    materials: {
      color: new THREE.Color(0x2a1600),
      emissive: new THREE.Color(0xffc400),
      roughness: 0.2,
      metalness: 0.9,
      waveType: 2,
      freq: 0.8,
      amp: 0.4,
      bloom: 0.62,
      particles: 0.22,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    extreme: {
      color: new THREE.Color(0x221100),
      emissive: new THREE.Color(0xffaa00),
      roughness: 0.4,
      metalness: 0.6,
      waveType: 0,
      freq: 0.1,
      amp: 2.5,
      bloom: 0.58,
      particles: 0.2,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    value: {
      color: new THREE.Color(0x150b22),
      emissive: new THREE.Color(0x8b5cf6),
      roughness: 0.18,
      metalness: 0.75,
      waveType: 1,
      freq: 1.1,
      amp: 0.6,
      bloom: 0.64,
      particles: 0.25,
      noGrid: 1.0,
      showValueBackdrop: 1.0,
    },
    medical: {
      color: new THREE.Color(0x001408),
      emissive: new THREE.Color(0x35ff6a),
      roughness: 0.12,
      metalness: 0.08,
      waveType: 2,
      freq: 0.75,
      amp: 0.9,
      bloom: 0.68,
      particles: 0.18,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    readiness: {
      color: new THREE.Color(0x091224),
      emissive: new THREE.Color(0x5f8fff),
      roughness: 0.16,
      metalness: 0.86,
      waveType: 1,
      freq: 0.95,
      amp: 0.58,
      bloom: 0.64,
      particles: 0.2,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    competitive: {
      color: new THREE.Color(0x08101f),
      emissive: new THREE.Color(0x3b82f6),
      roughness: 0.18,
      metalness: 0.86,
      waveType: 1,
      freq: 0.9,
      amp: 0.55,
      bloom: 0.62,
      particles: 0.18,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    implantes: {
      color: new THREE.Color(0x0b0b0b),
      emissive: new THREE.Color(0xf5f5f2),
      roughness: 0.25,
      metalness: 0.85,
      waveType: 1,
      freq: 1.0,
      amp: 0.6,
      bloom: 0.55,
      particles: 0.22,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    "sectors-strategic": {
      color: new THREE.Color(0x04160f),
      emissive: new THREE.Color(0x57f08e),
      roughness: 0.14,
      metalness: 0.16,
      waveType: 2,
      freq: 0.82,
      amp: 0.82,
      bloom: 0.7,
      particles: 0.19,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    sovereignty: {
      color: new THREE.Color(0x160a02),
      emissive: new THREE.Color(0xdf6d0f),
      roughness: 0.26,
      metalness: 0.72,
      waveType: 0,
      freq: 0.45,
      amp: 0.7,
      bloom: 0.58,
      particles: 0.16,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
    cta: {
      color: new THREE.Color(0x051018),
      emissive: new THREE.Color(0x8b5cf6),
      roughness: 0.16,
      metalness: 0.84,
      waveType: 2,
      freq: 0.8,
      amp: 0.6,
      bloom: 0.64,
      particles: 0.22,
      noGrid: 0.0,
      showValueBackdrop: 0.0,
    },
  };

  let current = {
    color: STATES.hero.color.clone(),
    emissive: STATES.hero.emissive.clone(),
    roughness: STATES.hero.roughness,
    metalness: STATES.hero.metalness,
    waveType: STATES.hero.waveType,
    freq: STATES.hero.freq,
    amp: STATES.hero.amp,
    bloom: STATES.hero.bloom,
    particles: STATES.hero.particles,
    noGrid: STATES.hero.noGrid,
    showValueBackdrop: STATES.hero.showValueBackdrop,
  };

  let target = STATES.hero;

  const MEDICAL_EMISSIVE = new THREE.Color(0x35ff6a);
  const IMPLANTES_EMISSIVE = new THREE.Color(0xf5f5f2);
  const isIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const debugFlags = getThreeDebugFlags();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const saveData = Boolean(connection?.saveData);
  const networkIsSlow = /(?:^|slow-)2g$/.test(String(connection?.effectiveType || ""));
  const deviceMemory = Number(navigator.deviceMemory || 0);
  const hardwareConcurrency = Number(navigator.hardwareConcurrency || 0);
  const isLowPower = isIOS || isAndroid;
  const requestedPerformanceMode =
    debugFlags.force ? "full" : options.performanceMode === "reduced" ? "reduced" : "full";
  const useReducedProfile =
    requestedPerformanceMode === "reduced" ||
    saveData ||
    networkIsSlow ||
    prefersReducedMotion ||
    (deviceMemory > 0 && deviceMemory <= 4) ||
    (hardwareConcurrency > 0 && hardwareConcurrency <= 4);
  const useComposer = !isLowPower && !useReducedProfile;
  const SPEED = prefersReducedMotion ? 0.12 : isLowPower ? 0.18 : 0.25;
  const vv = window.visualViewport || null;
  const visibilityBoost = useReducedProfile ? 1.55 : isLowPower ? 1.32 : 1;
  const particleBoost = useReducedProfile ? 1.2 : isLowPower ? 1.1 : 1;
  const clearAlpha = debugFlags.opaque ? 1 : useReducedProfile ? 0.16 : isLowPower ? 0.12 : 0;
  const logPrefix = "[ThreeBG]";

  let rafId = 0;
  let running = false;
  let contextLost = false;
  let disposed = false;
  let firstFrameRendered = false;
  let contextEventLabel = "none";
  let lastError = "";

  const logDebug = (message, extra) => {
    if (!debugFlags.enabled) return;
    if (typeof extra === "undefined") console.info(`${logPrefix} ${message}`);
    else console.info(`${logPrefix} ${message}`, extra);
  };

  logDebug("init start", {
    flags: debugFlags,
    requestedPerformanceMode,
    useReducedProfile,
    prefersReducedMotion,
    saveData,
    effectiveType: connection?.effectiveType || "",
    deviceMemory,
    hardwareConcurrency,
  });

  function getViewportSize() {
    const width = vv ? vv.width : window.innerWidth;
    const height = vv ? vv.height : window.innerHeight;
    return {
      w: Math.max(1, Math.round(width)),
      h: Math.max(1, Math.round(height)),
    };
  }

  function getViewportOffsets() {
    return {
      x: Math.round(vv ? vv.offsetLeft : 0),
      y: Math.round(vv ? vv.offsetTop : 0),
    };
  }

  function colorDist(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x020202, 0.01);

  const initialViewport = getViewportSize();
  const camera = new THREE.PerspectiveCamera(
    45,
    initialViewport.w / initialViewport.h,
    0.1,
    220
  );
  camera.position.set(0, 25, 50);
  const mountRoot = getMountRoot();

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
    });
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
    mountRoot.dataset.threeStatus = "renderer-error";
    mountRoot.dataset.threeError = lastError;
    logDebug("fallback activated", { stage: "renderer-init", error: lastError });
    syncThreeBodyState(false);
    throw error;
  }

  renderer.setClearColor(0x02060b, clearAlpha);
  renderer.setSize(initialViewport.w, initialViewport.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = useReducedProfile ? 1.2 : isLowPower ? 1.12 : 1;
  logDebug("renderer ok", {
    alpha: true,
    clearAlpha,
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  });

  function getMountRoot() {
    let root = document.getElementById(THREE_ROOT_ID);
    if (root) return root;

    root = document.createElement("div");
    root.id = THREE_ROOT_ID;
    root.className = THREE_ROOT_ID;
    root.setAttribute("aria-hidden", "true");
    document.body.prepend(root);
    return root;
  }

  logDebug("mount root ok", { rootId: mountRoot.id });
  const canvas = renderer.domElement;
  canvas.classList.add("three-bg-canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.display = "block";
  canvas.style.zIndex = "1";
  canvas.style.opacity = "0";
  canvas.style.visibility = "hidden";
  canvas.style.transform = "translate3d(0,0,0)";
  canvas.style.webkitTransform = "translate3d(0,0,0)";
  canvas.style.backfaceVisibility = "hidden";
  canvas.style.webkitBackfaceVisibility = "hidden";
  canvas.style.willChange = "transform";
  if (debugFlags.enabled) {
    canvas.style.outline = "1px dashed rgba(120,200,255,.85)";
    canvas.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,.14), 0 0 28px rgba(120,200,255,.12)";
  }

  function ensureDebugStyle() {
    if (!debugFlags.enabled || document.getElementById(THREE_DEBUG_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = THREE_DEBUG_STYLE_ID;
    style.textContent = `
#${THREE_DEBUG_PANEL_ID}{
  position:fixed;
  left:12px;
  bottom:12px;
  z-index:2147483647;
  width:min(320px, calc(100vw - 24px));
  padding:10px 12px;
  border-radius:12px;
  border:1px solid rgba(120,200,255,.35);
  background:rgba(7,10,14,.86);
  color:#eaf6ff;
  font:12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  box-shadow:0 14px 40px rgba(0,0,0,.35);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  pointer-events:none;
  white-space:pre-wrap;
}
#${THREE_DEBUG_OVERLAY_ID}{
  position:absolute;
  inset:0;
  z-index:2;
  pointer-events:none;
  border:1px dashed rgba(120,200,255,.7);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.16), inset 0 0 40px rgba(120,200,255,.12);
  background:linear-gradient(180deg, rgba(0,255,255,.05), rgba(255,255,255,.02));
}
`;
    document.head.appendChild(style);
  }

  function ensureDebugPanel() {
    if (!debugFlags.enabled) return null;
    ensureDebugStyle();
    let panel = document.getElementById(THREE_DEBUG_PANEL_ID);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = THREE_DEBUG_PANEL_ID;
      panel.setAttribute("aria-hidden", "true");
      document.body.appendChild(panel);
    }
    return panel;
  }

  function ensureDebugOverlay() {
    if (!debugFlags.enabled) return null;
    let overlay = document.getElementById(THREE_DEBUG_OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = THREE_DEBUG_OVERLAY_ID;
      overlay.setAttribute("aria-hidden", "true");
      mountRoot.appendChild(overlay);
    }
    return overlay;
  }

  const debugPanel = ensureDebugPanel();
  const debugOverlay = ensureDebugOverlay();

  function removeDuplicateCanvases() {
    const canvases = document.querySelectorAll(`#${THREE_ROOT_ID} canvas.three-bg-canvas, body > canvas.three-bg-canvas`);
    canvases.forEach((node) => {
      if (node !== canvas && node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function layoutMountRoot() {
    const { w, h } = getViewportSize();
    const { x, y } = getViewportOffsets();

    mountRoot.style.width = `${w}px`;
    mountRoot.style.height = `${h}px`;
    mountRoot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    mountRoot.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`;
    setViewportHeightVar(h);
  }

  function syncRuntimeDiagnostics(reason = "update") {
    const viewport = getViewportSize();
    const cssViewport = {
      w: Math.max(1, Math.round(document.documentElement.clientWidth || window.innerWidth || 0)),
      h: Math.max(1, Math.round(document.documentElement.clientHeight || window.innerHeight || 0)),
    };
    const mounted = canvas.isConnected && canvas.parentNode === mountRoot;
    const rendererSize = new THREE.Vector2();
    renderer.getSize(rendererSize);
    const drawingBuffer = new THREE.Vector2();
    renderer.getDrawingBufferSize(drawingBuffer);
    const status = contextLost
      ? "context-lost"
      : disposed
        ? "disposed"
        : mounted
          ? "mounted"
          : "detached";

    mountRoot.dataset.threeStatus = status;
    mountRoot.dataset.threeReason = reason;
    mountRoot.dataset.threeMode = useReducedProfile ? "reduced" : "full";
    mountRoot.dataset.threeMounted = mounted ? "yes" : "no";
    mountRoot.dataset.threeAnimating = running && !debugFlags.noAnim ? "yes" : "no";
    mountRoot.dataset.threeCanvas = `${canvas.width}x${canvas.height}`;
    mountRoot.dataset.threeRenderer = `${Math.round(rendererSize.x)}x${Math.round(rendererSize.y)}`;
    mountRoot.dataset.threeDpr = String(Math.min(window.devicePixelRatio || 1, 1.5));
    mountRoot.dataset.threeViewport = `${viewport.w}x${viewport.h}`;
    mountRoot.dataset.threeCssViewport = `${cssViewport.w}x${cssViewport.h}`;
    mountRoot.dataset.threeError = lastError || "none";
    mountRoot.dataset.threeContext = contextEventLabel;

    if (!debugPanel) return;

    debugPanel.textContent =
      `status: ${status}\n` +
      `mode: ${useReducedProfile ? "reduced" : "full"}${debugFlags.force ? " (forced)" : ""}\n` +
      `mounted: ${mounted ? "yes" : "no"}\n` +
      `animating: ${running && !debugFlags.noAnim ? "yes" : "no"}\n` +
      `canvas size: ${canvas.width}x${canvas.height}\n` +
      `renderer size: ${Math.round(rendererSize.x)}x${Math.round(rendererSize.y)} | draw ${Math.round(drawingBuffer.x)}x${Math.round(drawingBuffer.y)}\n` +
      `DPR: ${Math.min(window.devicePixelRatio || 1, 1.5)}\n` +
      `viewport JS: ${viewport.w}x${viewport.h}\n` +
      `viewport CSS: ${cssViewport.w}x${cssViewport.h}\n` +
      `body classes: ${document.body.className || "(none)"}\n` +
      `context: ${contextEventLabel}\n` +
      `error: ${lastError || "none"}`;
  }

  function isCanvasRenderable() {
    if (disposed || contextLost) return false;
    if (!canvas.isConnected || canvas.parentNode !== mountRoot) return false;

    const computed = window.getComputedStyle(canvas);
    if (computed.display === "none" || computed.visibility === "hidden") return false;
    if (Number.parseFloat(computed.opacity || "1") <= 0) return false;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || canvas.width;
    const height = rect.height || canvas.clientHeight || canvas.height;
    return width > 0 && height > 0;
  }

  function ensureCanvasMounted() {
    if (disposed) return;
    if (!mountRoot.isConnected) document.body.prepend(mountRoot);
    layoutMountRoot();
    if (canvas.parentNode !== mountRoot) mountRoot.appendChild(canvas);
    removeDuplicateCanvases();
    if (contextLost) {
      canvas.style.opacity = "0";
      canvas.style.visibility = "hidden";
      syncThreeBodyState(false);
      return;
    }
    canvas.style.opacity = "1";
    canvas.style.visibility = "visible";
    if (debugOverlay && debugOverlay.parentNode !== mountRoot) {
      mountRoot.appendChild(debugOverlay);
    }
    syncRuntimeDiagnostics("mounted");
    syncThreeBodyState(isCanvasRenderable());
    logDebug("mount ok", {
      mounted: canvas.parentNode === mountRoot,
      canvas: `${canvas.width}x${canvas.height}`,
    });
  }

  ensureCanvasMounted();

  scene.add(new THREE.AmbientLight(0xffffff, useReducedProfile ? 2.55 : isLowPower ? 2.25 : 2.0));
  const mainLight = new THREE.DirectionalLight(0xffffff, useReducedProfile ? 3.4 : 3.0);
  mainLight.position.set(10, 20, 10);
  scene.add(mainLight);
  logDebug("scene ok", { staticScene: debugFlags.staticScene });

  let staticDebugMesh = null;
  if (debugFlags.staticScene) {
    scene.background = new THREE.Color(0x16324f);
    scene.fog = null;

    const staticGeo = new THREE.IcosahedronGeometry(11, 1);
    const staticMat = new THREE.MeshBasicMaterial({
      color: 0x7fe8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.95,
    });
    staticDebugMesh = new THREE.Mesh(staticGeo, staticMat);
    staticDebugMesh.position.set(0, 8, 0);
    scene.add(staticDebugMesh);
  }

  const geometry = new THREE.TetrahedronGeometry(0.15, 0);
  geometry.scale(1, 5, 1);
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 1.0,
    emissive: 0x000000,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 1.0,
  });

  const ROWS = useReducedProfile ? 54 : isLowPower ? 68 : 100;
  const COLS = useReducedProfile ? 54 : isLowPower ? 68 : 100;
  const gridMesh = new THREE.InstancedMesh(geometry, material, ROWS * COLS);
  gridMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(gridMesh);

  const dummy = new THREE.Object3D();
  const positions = [];
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      positions.push({
        x: (i - COLS / 2) * 0.7,
        z: (j - ROWS / 2) * 0.7,
      });
      gridMesh.setMatrixAt(i * ROWS + j, dummy.matrix);
    }
  }

  const PCOUNT = useReducedProfile ? 640 : isLowPower ? 920 : 1800;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PCOUNT * 3);
  const pVel = new Float32Array(PCOUNT);
  const rangeX = 80;
  const rangeY = 28;
  const rangeZ = 140;

  for (let i = 0; i < PCOUNT; i++) {
    const ix = i * 3;
    pPos[ix + 0] = (Math.random() - 0.5) * rangeX;
    pPos[ix + 1] = Math.random() * rangeY + 2;
    pPos[ix + 2] = (Math.random() - 0.5) * rangeZ;
    pVel[i] = 6 + Math.random() * 18;
  }

  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(pGeo, pMat);
  particles.frustumCulled = false;
  scene.add(particles);

  const valueBackdrop = new THREE.Group();
  valueBackdrop.frustumCulled = false;
  valueBackdrop.visible = false;
  scene.add(valueBackdrop);

  const VALUE_NODES = useReducedProfile ? 80 : isLowPower ? 110 : 170;
  const valueGeo = new THREE.BufferGeometry();
  const valueBasePos = new Float32Array(VALUE_NODES * 3);
  const valuePos = new Float32Array(VALUE_NODES * 3);
  const valueSeeds = new Float32Array(VALUE_NODES);

  const valueRangeX = 78;
  const valueRangeY = 32;
  const valueRangeZ = 80;

  for (let i = 0; i < VALUE_NODES; i++) {
    const ix = i * 3;
    const x = (Math.random() - 0.5) * valueRangeX;
    const y = Math.random() * valueRangeY + 6;
    const z = (Math.random() - 0.5) * valueRangeZ;

    valueBasePos[ix + 0] = x;
    valueBasePos[ix + 1] = y;
    valueBasePos[ix + 2] = z;

    valuePos[ix + 0] = x;
    valuePos[ix + 1] = y;
    valuePos[ix + 2] = z;

    valueSeeds[i] = Math.random() * Math.PI * 2;
  }

  valueGeo.setAttribute("position", new THREE.BufferAttribute(valuePos, 3));

  const valueMat = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.085,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const valuePoints = new THREE.Points(valueGeo, valueMat);
  valuePoints.frustumCulled = false;
  valueBackdrop.add(valuePoints);

  const valueConnections = [];
  const maxConnectionsPerNode = 2;
  const maxDistance = 18;
  const attemptsPerNode = 5;

  for (let i = 0; i < VALUE_NODES; i++) {
    let connectionsForNode = 0;
    for (let attempt = 0; attempt < attemptsPerNode; attempt++) {
      if (connectionsForNode >= maxConnectionsPerNode) break;
      const j = Math.floor(Math.random() * VALUE_NODES);
      if (i === j) continue;

      const ix = i * 3;
      const jx = j * 3;
      const dx = valueBasePos[ix] - valueBasePos[jx];
      const dy = valueBasePos[ix + 1] - valueBasePos[jx + 1];
      const dz = valueBasePos[ix + 2] - valueBasePos[jx + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= maxDistance) {
        valueConnections.push([i, j]);
        connectionsForNode++;
      }
    }
  }

  const valueLineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(valueConnections.length * 2 * 3);
  valueLineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

  const valueLineMat = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const valueLines = new THREE.LineSegments(valueLineGeo, valueLineMat);
  valueLines.frustumCulled = false;
  valueBackdrop.add(valueLines);

  if (debugFlags.staticScene) {
    gridMesh.visible = false;
    particles.visible = false;
    valueBackdrop.visible = false;
  }

  let composer = null;
  let bloomPass = null;
  if (useComposer) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(initialViewport.w, initialViewport.h),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.6;
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);
  }

  const clock = new THREE.Clock();
  const damp = (lambda, dt) => 1 - Math.exp(-lambda * dt);
  let lastT = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const targetPos = new THREE.Vector3(0, -100, 0);

  const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  function setTargetState(name) {
    target = STATES[name] ?? STATES.hero;
  }

  let pulse = 0;
  const PULSE_DECAY = 5.5;
  const onFundingOpen = () => {
    pulse = Math.min(1, pulse + 1);
  };
  const onFundingClose = () => {
    pulse = Math.min(1, pulse + 0.5);
  };

  window.addEventListener("funding:open", onFundingOpen);
  window.addEventListener("funding:close", onFundingClose);

  function forceResize() {
    if (disposed || contextLost) return;

    const { w, h } = getViewportSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    if (renderer.domElement.width === 0 || renderer.domElement.height === 0) {
      renderer.setSize(Math.max(1, w), Math.max(1, h), false);
    }

    if (useComposer && composer && bloomPass) {
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    }

    layoutMountRoot();
    syncRuntimeDiagnostics("resize");
    syncThreeBodyState(isCanvasRenderable());
    logDebug(`resize ${w}x${h}`);
  }

  function resetAfterSleep() {
    if (disposed) return;
    clock.stop();
    clock.start();
    lastT = 0;
    targetPos.set(0, -100, 0);
    forceResize();
  }

  function stopLoop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function startLoop() {
    if (disposed || contextLost || running) return;
    if (debugFlags.noAnim) {
      running = false;
      tryRenderFrame("static-frame");
      syncRuntimeDiagnostics("static-frame");
      return;
    }
    running = true;
    syncRuntimeDiagnostics("start-loop");
    rafId = requestAnimationFrame(animate);
  }

  function pause() {
    stopLoop();
    syncRuntimeDiagnostics("pause");
  }

  function resume() {
    if (disposed || contextLost) return;
    ensureCanvasMounted();
    if (running) {
      forceResize();
      return;
    }
    resetAfterSleep();
    startLoop();
  }

  function refresh() {
    if (disposed) return;
    ensureCanvasMounted();
    forceResize();
  }

  const onContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    contextEventLabel = "lost";
    canvas.style.opacity = "0";
    canvas.style.visibility = "hidden";
    syncRuntimeDiagnostics("context-lost");
    syncThreeBodyState(false);
    logDebug("context lost");
    pause();
  };

  const onContextRestored = () => {
    contextLost = false;
    contextEventLabel = "restored";
    canvas.style.opacity = "1";
    canvas.style.visibility = "visible";
    syncRuntimeDiagnostics("context-restored");
    syncThreeBodyState(isCanvasRenderable());
    logDebug("context restored");
    resume();
  };

  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  const onVisibility = () => {
    if (disposed) return;
    if (document.hidden) {
      pause();
      return;
    }
    if (!contextLost) resume();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onPageShow = () => {
    if (disposed || contextLost) return;
    refresh();
    resume();
  };
  const onPageHide = () => {
    if (disposed) return;
    pause();
  };

  window.addEventListener("pageshow", onPageShow);
  window.addEventListener("pagehide", onPageHide);

  const onFocus = () => {
    if (!document.hidden && !contextLost) resume();
  };
  window.addEventListener("focus", onFocus);

  const onLoad = () => {
    if (disposed || contextLost) return;
    refresh();
  };
  window.addEventListener("load", onLoad);

  function handleRenderError(error, stage) {
    lastError = error instanceof Error ? error.message : String(error);
    running = false;
    syncRuntimeDiagnostics(stage);
    logDebug("fallback activated", { stage, error: lastError });
    console.error(`${logPrefix} ${stage}`, error);
  }

  function renderFrame() {
    const t = clock.getElapsedTime();
    const ts = t * SPEED;

    let dt = t - lastT;
    lastT = t;
    if (!Number.isFinite(dt) || dt < 0) dt = 0;
    dt = Math.min(dt, 1 / 45);

    pulse *= 1 - damp(PULSE_DECAY, dt);

    const lerpState = damp(4.5, dt);
    const lerpMouse = damp(7.5, dt);

    current.color.lerp(target.color, lerpState);
    current.emissive.lerp(target.emissive, lerpState);
    current.roughness += (target.roughness - current.roughness) * lerpState;
    current.metalness += (target.metalness - current.metalness) * lerpState;

    const lerpShape = lerpState * 0.45;
    current.waveType += (target.waveType - current.waveType) * lerpShape;
    current.freq += (target.freq - current.freq) * lerpShape;
    current.amp += (target.amp - current.amp) * lerpShape;

    current.bloom += (target.bloom - current.bloom) * lerpState;
    current.particles += (target.particles - current.particles) * lerpState;
    current.noGrid += (target.noGrid - current.noGrid) * lerpState;
    current.showValueBackdrop += (target.showValueBackdrop - current.showValueBackdrop) * lerpState;

    raycaster.setFromCamera(mouse, camera);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersect);
    if (intersect) targetPos.lerp(intersect, lerpMouse);

    camera.position.set(0, 25, 50);
    camera.lookAt(0, 0, 0);

    const pulseBloom = 1 + pulse * 0.45;
    const pulseParticles = 1 + pulse * 0.28;

    const distToMedical = colorDist(current.emissive, MEDICAL_EMISSIVE);
    const medicalMix = 1 - THREE.MathUtils.smoothstep(distToMedical, 0.25, 0.75);
    const medicalDim = THREE.MathUtils.lerp(1.0, 0.55, medicalMix);

    const distToImplantes = colorDist(current.emissive, IMPLANTES_EMISSIVE);
    const implantesMix = 1 - THREE.MathUtils.smoothstep(distToImplantes, 0.18, 0.55);
    const implantesDim = THREE.MathUtils.lerp(1.0, 0.78, implantesMix);
    const sectionDim = Math.min(medicalDim, implantesDim);

    if (useComposer && bloomPass) {
      bloomPass.strength = Math.min(0.75, current.bloom * pulseBloom * sectionDim);
      bloomPass.radius = 0.75 + pulse * 0.12;
      bloomPass.threshold = 0.12;
    }

    pMat.color.copy(current.emissive);
    pMat.opacity =
      (0.05 + current.particles * 0.20) * pulseParticles * sectionDim * particleBoost;

    gridMesh.visible = !(current.noGrid > 0.5);
    valueBackdrop.visible = current.showValueBackdrop > 0.01;

    material.color.copy(current.color).multiplyScalar(isLowPower ? 1.08 : 1);
    material.emissive.copy(current.emissive).multiplyScalar(sectionDim * visibilityBoost);
    material.roughness = current.roughness;
    material.metalness = current.metalness;

    if (staticDebugMesh) {
      staticDebugMesh.rotation.y += debugFlags.noAnim ? 0 : dt * 0.9;
      staticDebugMesh.rotation.x += debugFlags.noAnim ? 0 : dt * 0.35;
    } else if (gridMesh.visible) {
      let idx = 0;
      const animTime = ts * current.freq;

      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const p = positions[idx];

          const valWave =
            Math.sin(p.x * 0.2 + animTime) +
            Math.cos(p.z * 0.15 + animTime * 0.8);

          const valJitter =
            Math.sin(p.x * 6 + ts * 2.2) * Math.cos(p.z * 6 + ts * 2.2);

          const rawGrid =
            Math.sin(p.x * 0.3 + animTime) * Math.cos(p.z * 0.3 + animTime);

          const valGrid = Math.pow(rawGrid, 3) * 4.0;
          const combo = valWave * 0.2 + valJitter * 0.8;

          const a01 = THREE.MathUtils.smoothstep(current.waveType, 0.0, 1.0);
          const mix01 = THREE.MathUtils.lerp(valWave, combo, a01);

          const a12 = THREE.MathUtils.smoothstep(current.waveType, 1.0, 2.0);
          const finalVal = THREE.MathUtils.lerp(mix01, valGrid, a12);

          let y = finalVal * current.amp;

          const dist = Math.sqrt((p.x - targetPos.x) ** 2 + (p.z - targetPos.z) ** 2);
          const influence = Math.max(0, 1 - dist / 15);
          const smoothInf = influence * influence * (3 - 2 * influence);
          y = y * (1 - smoothInf);

          const rotX = Math.cos(p.x * 0.2 + ts) * 0.5 * (1 - smoothInf) * current.amp;
          const rotZ = Math.sin(p.z * 0.2 + ts) * 0.5 * (1 - smoothInf) * current.amp;

          dummy.position.set(p.x, y, p.z);
          dummy.rotation.set(rotX, 0, rotZ);

          const s = 1 + smoothInf * 0.5;
          dummy.scale.set(s, s, s);

          dummy.updateMatrix();
          gridMesh.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }

      gridMesh.instanceMatrix.needsUpdate = true;
    }

    const arrP = pGeo.attributes.position.array;
    for (let i = 0; i < PCOUNT; i++) {
      const ix = i * 3;

      arrP[ix + 0] *= 0.9996;
      arrP[ix + 1] += Math.sin(ts * 0.6 + i) * 0.00035;
      arrP[ix + 2] += pVel[i] * dt * (0.45 + current.particles * 0.9);

      if (arrP[ix + 2] > rangeZ * 0.5) {
        arrP[ix + 2] = -rangeZ * 0.5;
        arrP[ix + 0] = (Math.random() - 0.5) * rangeX;
        arrP[ix + 1] = Math.random() * rangeY + 2;
        pVel[i] = 6 + Math.random() * 18;
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    if (valueBackdrop.visible) {
      const vArr = valueGeo.attributes.position.array;
      for (let i = 0; i < VALUE_NODES; i++) {
        const ix = i * 3;
        const seed = valueSeeds[i];
        vArr[ix + 0] = valueBasePos[ix + 0] + Math.sin(ts * 0.08 + seed) * 0.6;
        vArr[ix + 1] = valueBasePos[ix + 1] + Math.cos(ts * 0.07 + seed) * 0.4;
        vArr[ix + 2] = valueBasePos[ix + 2] + Math.sin(ts * 0.06 + seed * 1.3) * 0.5;
      }
      valueGeo.attributes.position.needsUpdate = true;

      const lArr = valueLineGeo.attributes.position.array;
      let lIndex = 0;
      for (let i = 0; i < valueConnections.length; i++) {
        const [a, b] = valueConnections[i];
        const ax = a * 3;
        const bx = b * 3;
        lArr[lIndex++] = vArr[ax + 0];
        lArr[lIndex++] = vArr[ax + 1];
        lArr[lIndex++] = vArr[ax + 2];
        lArr[lIndex++] = vArr[bx + 0];
        lArr[lIndex++] = vArr[bx + 1];
        lArr[lIndex++] = vArr[bx + 2];
      }
      valueLineGeo.attributes.position.needsUpdate = true;
    }

    if (useComposer && composer) composer.render();
    else renderer.render(scene, camera);

    if (!firstFrameRendered) {
      firstFrameRendered = true;
      syncRuntimeDiagnostics("first-frame");
      logDebug("first frame rendered");
    }
  }

  function tryRenderFrame(stage) {
    try {
      renderFrame();
    } catch (error) {
      handleRenderError(error, stage);
    }
  }

  function animate() {
    if (!running || contextLost || disposed) return;
    rafId = requestAnimationFrame(animate);
    tryRenderFrame("animate");
  }

  const onResize = () => refresh();
  const onVisualViewportChange = () => refresh();
  const onOrientationChange = () => refresh();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onOrientationChange, { passive: true });
  if (vv) {
    vv.addEventListener("resize", onVisualViewportChange, { passive: true });
    vv.addEventListener("scroll", onVisualViewportChange, { passive: true });
  }

  startLoop();

  function dispose() {
    if (disposed) return;
    disposed = true;
    pause();
    syncRuntimeDiagnostics("dispose");
    syncThreeBodyState(false);
    logDebug("destroy");

    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("load", onLoad);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientationChange);
    if (vv) {
      vv.removeEventListener("resize", onVisualViewportChange);
      vv.removeEventListener("scroll", onVisualViewportChange);
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("funding:open", onFundingOpen);
    window.removeEventListener("funding:close", onFundingClose);

    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);

    composer?.dispose?.();
    pGeo.dispose();
    pMat.dispose();
    valueGeo.dispose();
    valueMat.dispose();
    valueLineGeo.dispose();
    valueLineMat.dispose();
    staticDebugMesh?.geometry?.dispose?.();
    staticDebugMesh?.material?.dispose?.();
    geometry.dispose();
    material.dispose();
    renderer.dispose();

    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (debugOverlay?.parentNode) debugOverlay.parentNode.removeChild(debugOverlay);
    if (debugPanel?.parentNode) debugPanel.parentNode.removeChild(debugPanel);
    if (!mountRoot.hasChildNodes() && mountRoot.parentNode) {
      mountRoot.parentNode.removeChild(mountRoot);
    }
    if (window[GLOBAL_BG_KEY] === api) delete window[GLOBAL_BG_KEY];
  }

  function isDisposed() {
    return disposed;
  }

  const api = {
    setTargetState,
    pause,
    resume,
    refresh,
    dispose,
    destroy: dispose,
    ensureCanvasMounted,
    isDisposed,
  };

  window[GLOBAL_BG_KEY] = api;
  return api;
}
