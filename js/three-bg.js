import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export function initThreeBackground() {
  // --- CONFIGURACIÓN ---
  const STATES = {
    hero: {
      // oscuro y cinematográfico (el foco blanco lo hace CSS en el hero)
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
  const isLowPower = isIOS || /Android/i.test(navigator.userAgent);
  const useComposer = !isLowPower;

  function colorDist(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // --- SETUP ---
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x020202, 0.01);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    220
  );
  camera.position.set(0, 25, 50);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    stencil: false,
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // ✅ evita duplicados si se inicializa 2 veces
  const existing = document.querySelector("canvas.three-bg-canvas");
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  // Canvas fixed + class
  const canvas = renderer.domElement;
  canvas.classList.add("three-bg-canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.display = "block";
  canvas.style.zIndex = "0";
  canvas.style.transform = "translate3d(0,0,0)";
  canvas.style.webkitTransform = "translate3d(0,0,0)";
  canvas.style.backfaceVisibility = "hidden";
  canvas.style.webkitBackfaceVisibility = "hidden";
  canvas.style.willChange = "transform";
  document.body.appendChild(canvas);
  document.body.classList.remove("no-three");

  let onIOSScroll = null;
  if (isIOS) {
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = window.scrollY + "px";
    canvas.style.right = "0";
    canvas.style.bottom = "auto";

    let ticking = false;
    const syncCanvasTop = () => {
      ticking = false;
      canvas.style.top = window.scrollY + "px";
    };

    onIOSScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncCanvasTop);
      }
    };

    window.addEventListener("scroll", onIOSScroll, { passive: true });
  }

  // --- LUCES ---
  scene.add(new THREE.AmbientLight(0xffffff, 2.0));
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  mainLight.position.set(10, 20, 10);
  scene.add(mainLight);

  // GRID (MALLA)
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

  const ROWS = isLowPower ? 68 : 100;
  const COLS = isLowPower ? 68 : 100;

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

  // PARTÍCULAS
  const PCOUNT = isLowPower ? 920 : 1800;
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

  // VALUE BACKDROP (NETWORK)
  const valueBackdrop = new THREE.Group();
  valueBackdrop.frustumCulled = false;
  valueBackdrop.visible = false;
  scene.add(valueBackdrop);

  const VALUE_NODES = isLowPower ? 110 : 170;
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

  // POST-PROCESSING
  let composer = null;
  let bloomPass = null;
  if (useComposer) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.6;
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);
  }

  // INPUT
  const clock = new THREE.Clock();
  const damp = (lambda, dt) => 1 - Math.exp(-lambda * dt);
  let lastT = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const targetPos = new THREE.Vector3(0, -100, 0);

  const onMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  // API
  function setTargetState(name) {
    target = STATES[name] ?? STATES.hero;
  }

  // FUNDING HOOK (cinematic pulse)
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

  // ANTI-PETADAS
  let rafId = 0;
  let running = true;
  let contextLost = false;

  function forceResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.25));

    if (useComposer) {
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    }

    if (isIOS) canvas.style.top = window.scrollY + "px";
  }

  function resetAfterSleep() {
    clock.stop();
    clock.start();
    lastT = 0;
    targetPos.set(0, -100, 0);
    forceResize();
    if (isIOS) canvas.style.top = window.scrollY + "px";
  }

  function stopLoop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  const onContextLost = (e) => {
    e.preventDefault();
    contextLost = true;
    console.warn("[three] context lost");
    canvas.style.opacity = "0";
    document.body.classList.add("no-three");
    stopLoop();
  };

  const onContextRestored = () => {
    contextLost = false;
    console.warn("[three] context restored");
    canvas.style.opacity = "1";
    document.body.classList.remove("no-three");
    forceResize();
    resetAfterSleep();
    running = true;
    rafId = requestAnimationFrame(animate);
  };

  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  const onVisibility = () => {
    if (document.hidden) stopLoop();
    else if (!contextLost) {
      running = true;
      resetAfterSleep();
      rafId = requestAnimationFrame(animate);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onFocus = () => {
    if (!document.hidden && !contextLost) resetAfterSleep();
  };
  window.addEventListener("focus", onFocus);

  // LOOP
  function animate() {
    if (!running || contextLost) return;
    rafId = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

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

    if (useComposer) {
      bloomPass.strength = Math.min(0.75, current.bloom * pulseBloom * sectionDim);
      bloomPass.radius = 0.75 + pulse * 0.12;
      bloomPass.threshold = 0.12;
    }

    pMat.color.copy(current.emissive);
    pMat.opacity = (0.05 + current.particles * 0.20) * pulseParticles * sectionDim;

    gridMesh.visible = !(current.noGrid > 0.5);
    valueBackdrop.visible = current.showValueBackdrop > 0.01;

    material.color.copy(current.color);
    material.emissive.copy(current.emissive).multiplyScalar(sectionDim);
    material.roughness = current.roughness;
    material.metalness = current.metalness;

    // grid update
    if (gridMesh.visible) {
      let idx = 0;
      const animTime = t * current.freq;

      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const p = positions[idx];

          const valWave =
            Math.sin(p.x * 0.2 + animTime) +
            Math.cos(p.z * 0.15 + animTime * 0.8);

          const valJitter =
            Math.sin(p.x * 10 + t * 10) * Math.cos(p.z * 10 + t * 10);

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

          const rotX = Math.cos(p.x * 0.2 + t) * 0.5 * (1 - smoothInf) * current.amp;
          const rotZ = Math.sin(p.z * 0.2 + t) * 0.5 * (1 - smoothInf) * current.amp;

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

    // flow partículas
    const arrP = pGeo.attributes.position.array;
    for (let i = 0; i < PCOUNT; i++) {
      const ix = i * 3;

      arrP[ix + 0] *= 0.9996;
      arrP[ix + 1] += Math.sin(t * 0.6 + i) * 0.0006;

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
        vArr[ix + 0] = valueBasePos[ix + 0] + Math.sin(t * 0.08 + seed) * 0.6;
        vArr[ix + 1] = valueBasePos[ix + 1] + Math.cos(t * 0.07 + seed) * 0.4;
        vArr[ix + 2] = valueBasePos[ix + 2] + Math.sin(t * 0.06 + seed * 1.3) * 0.5;
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

    if (useComposer) composer.render();
    else renderer.render(scene, camera);
  }

  const onResize = () => forceResize();
  window.addEventListener("resize", onResize, { passive: true });

  clock.start();
  rafId = requestAnimationFrame(animate);

  function dispose() {
    stopLoop();

    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMouseMove);
    if (onIOSScroll) window.removeEventListener("scroll", onIOSScroll);

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

    gridMesh.geometry?.dispose?.();
    material.dispose?.();

    renderer.dispose();

    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  return { setTargetState, dispose };
}
