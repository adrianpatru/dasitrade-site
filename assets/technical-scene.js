import * as THREE from './vendor/three.module.js';

const TMP_WORLD = new THREE.Vector3();
const TMP_PROJECTED = new THREE.Vector3();
const ORIGIN = new THREE.Vector3(0, 0, 0);

function cssColor(value, fallback = '#84d3a6') {
  const color = new THREE.Color();

  try {
    color.setStyle(String(value || fallback));
  } catch {
    color.setStyle(fallback);
  }

  return color;
}

function alphaFromCss(value, fallback = 1) {
  const match = /rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/i.exec(String(value || ''));
  if (!match) return fallback;

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function supportsTechnical3D() {
  try {
    const probe = document.createElement('canvas');
    return !!(globalThis.WebGLRenderingContext && (probe.getContext('webgl') || probe.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

function setMaterialOpacity(material, opacity) {
  material.transparent = true;
  material.opacity = opacity;
}

function setGridOpacity(grid, opacity) {
  const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
  materials.forEach(material => {
    setMaterialOpacity(material, opacity);
  });
}

function createParticleField({ count, extent, lightMode }) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - 0.5) * extent;
    positions[offset + 1] = (Math.random() - 0.5) * extent * 0.55;
    positions[offset + 2] = (Math.random() - 0.5) * extent * 1.15;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: lightMode ? '#0f1316' : '#d7e2eb',
    size: lightMode ? 1.2 : 1.6,
    transparent: true,
    opacity: lightMode ? 0.16 : 0.18,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return {
    points: new THREE.Points(geometry, material),
    geometry,
    material,
  };
}

function createRings({ lightMode, mode }) {
  const radius = mode === 'home' ? 70 : mode === 'flow' ? 90 : 50;
  const rings = [];
  const color = lightMode ? '#101214' : '#84d3a6';

  for (let index = 0; index < 3; index += 1) {
    const geometry = new THREE.TorusGeometry(radius + index * 22, 0.8, 12, 72);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: lightMode ? 0.08 : 0.12,
      depthWrite: false,
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = index * 0.48;
    rings.push({ ring, geometry, material, baseRotation: ring.rotation.z });
  }

  return rings;
}

function createArchitecture({ lightMode, mode, variant = 'command' }) {
  const group = new THREE.Group();
  const disposables = [];
  const frameColor = lightMode ? '#101214' : '#84d3a6';
  const ghostColor = lightMode ? '#1d2126' : '#92bfff';
  const addWireBox = ({ size, position = [0, 0, 0], rotation = [0, 0, 0], color = frameColor, opacity = 0.08 }) => {
    const geometry = new THREE.BoxGeometry(...size);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    group.add(mesh);
    disposables.push({ geometry, material, mesh, baseRotation: mesh.rotation.y });
  };

  const addWireCylinder = ({ radiusTop, radiusBottom, height, radialSegments = 20, position = [0, 0, 0], rotation = [0, 0, 0], color = frameColor, opacity = 0.08 }) => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    group.add(mesh);
    disposables.push({ geometry, material, mesh, baseRotation: mesh.rotation.y });
  };

  const addWireTorus = ({ radius, tube = 1, radialSegments = 12, tubularSegments = 72, position = [0, 0, 0], rotation = [0, 0, 0], color = frameColor, opacity = 0.08 }) => {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    group.add(mesh);
    disposables.push({ geometry, material, mesh, baseRotation: mesh.rotation.y });
  };

  if (mode !== 'flow') {
    addWireBox({ size: [152, 104, 152], position: [0, 0, 0], color: frameColor, opacity: lightMode ? 0.05 : 0.1 });
    addWireBox({ size: [236, 156, 236], position: [0, 16, 0], rotation: [0, 0.34, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.08 });
    return { group, disposables };
  }

  switch (variant) {
    case 'gallery':
      addWireBox({ size: [220, 148, 28], position: [-228, 24, 96], rotation: [0.08, -0.32, 0], color: ghostColor, opacity: lightMode ? 0.05 : 0.1 });
      addWireBox({ size: [180, 124, 24], position: [0, 64, -136], rotation: [-0.04, 0.18, 0], color: frameColor, opacity: lightMode ? 0.05 : 0.09 });
      addWireBox({ size: [236, 162, 28], position: [236, 12, 88], rotation: [0.06, 0.34, 0], color: ghostColor, opacity: lightMode ? 0.05 : 0.1 });
      addWireBox({ size: [520, 16, 520], position: [0, -110, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireBox({ size: [300, 18, 300], position: [0, -74, 0], rotation: [0, 0.24, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireTorus({ radius: 180, tube: 1, position: [0, -40, 0], rotation: [Math.PI / 2, 0, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.07 });
      break;
    case 'control':
      addWireCylinder({ radiusTop: 188, radiusBottom: 188, height: 28, position: [0, -104, 0], color: frameColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireCylinder({ radiusTop: 142, radiusBottom: 142, height: 18, position: [0, -48, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.07 });
      addWireTorus({ radius: 190, tube: 1, position: [0, -24, 0], rotation: [Math.PI / 2, 0, 0], color: frameColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireTorus({ radius: 110, tube: 1, position: [0, 34, 0], rotation: [Math.PI / 2, 0, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.08 });
      [[-210, -12, 0], [210, -12, 0], [0, -12, -210], [0, -12, 210]].forEach((position, index) => {
        addWireBox({ size: [18, 172, 18], position, rotation: [0, index * 0.34, 0], color: index % 2 === 0 ? frameColor : ghostColor, opacity: lightMode ? 0.04 : 0.07 });
      });
      break;
    case 'crew':
      [-240, -80, 80, 240].forEach((z, index) => {
        addWireBox({ size: [212, 172, 26], position: [0, 4, z], color: index % 2 === 0 ? frameColor : ghostColor, opacity: lightMode ? 0.04 : 0.08 });
      });
      addWireBox({ size: [480, 24, 520], position: [0, -108, 0], color: ghostColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireBox({ size: [420, 18, 420], position: [0, 92, 0], rotation: [0, 0.2, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.05 });
      break;
    case 'archive':
      addWireBox({ size: [420, 32, 260], position: [0, -104, 0], rotation: [0, 0.08, 0], color: frameColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireBox({ size: [360, 24, 210], position: [0, -48, 0], rotation: [0, -0.16, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireBox({ size: [300, 20, 180], position: [0, 10, 0], rotation: [0, 0.22, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireBox({ size: [244, 18, 144], position: [0, 62, 0], rotation: [0, -0.24, 0], color: ghostColor, opacity: lightMode ? 0.03 : 0.06 });
      [[-190, -18, -94], [190, -18, 94]].forEach((position, index) => {
        addWireBox({ size: [18, 210, 18], position, rotation: [0, index === 0 ? 0.18 : -0.18, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.05 });
      });
      break;
    case 'systems':
      addWireBox({ size: [560, 18, 320], position: [0, -108, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireBox({ size: [520, 14, 42], position: [0, 84, 0], rotation: [0, 0.18, 0], color: ghostColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireBox({ size: [520, 12, 34], position: [0, -18, 0], rotation: [0, -0.22, 0], color: frameColor, opacity: lightMode ? 0.04 : 0.08 });
      addWireBox({ size: [86, 224, 54], position: [-216, -4, 92], rotation: [0.02, -0.22, 0], color: ghostColor, opacity: lightMode ? 0.05 : 0.1 });
      addWireBox({ size: [94, 246, 58], position: [0, 18, 0], rotation: [-0.04, 0.12, 0], color: frameColor, opacity: lightMode ? 0.05 : 0.1 });
      addWireBox({ size: [86, 216, 54], position: [216, -10, -96], rotation: [0.03, 0.28, 0], color: ghostColor, opacity: lightMode ? 0.05 : 0.1 });
      addWireBox({ size: [22, 164, 286], position: [-292, -16, 0], rotation: [0, 0.16, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireBox({ size: [22, 164, 286], position: [292, -16, 0], rotation: [0, -0.16, 0], color: frameColor, opacity: lightMode ? 0.03 : 0.06 });
      addWireTorus({ radius: 128, tube: 1, position: [0, 26, 0], rotation: [Math.PI / 2, 0, 0], color: ghostColor, opacity: lightMode ? 0.03 : 0.05 });
      break;
    case 'command':
    default:
      addWireBox({ size: [180, 132, 180], position: [0, 4, 0], color: frameColor, opacity: lightMode ? 0.08 : 0.16 });
      addWireBox({ size: [320, 212, 320], position: [0, 18, 0], rotation: [0, 0.34, 0], color: ghostColor, opacity: lightMode ? 0.05 : 0.11 });
      addWireBox({ size: [500, 298, 500], position: [0, 42, 0], rotation: [0, 0.68, 0], color: frameColor, opacity: lightMode ? 0.04 : 0.08 });
      [[-220, -18, -220], [220, -18, -220], [-220, -18, 220], [220, -18, 220]].forEach((position, index) => {
        addWireBox({ size: [14, 188, 14], position, rotation: [0, index * 0.28, 0], color: index % 2 === 0 ? frameColor : ghostColor, opacity: lightMode ? 0.04 : 0.08 });
      });
      break;
  }

  return { group, disposables };
}

function projectToScreen(camera, width, height, worldPosition) {
  TMP_PROJECTED.copy(worldPosition).project(camera);

  return {
    x: (TMP_PROJECTED.x * 0.5 + 0.5) * width,
    y: (-TMP_PROJECTED.y * 0.5 + 0.5) * height,
    ndcZ: TMP_PROJECTED.z,
  };
}

export function mountTechnicalScene({
  host,
  canvas,
  items,
  pointerTarget = host,
  mode = 'home',
  sceneVariant = 'command',
  lightMode = false,
  reducedMotion = false,
  useDeviceOrientation = false,
  getActiveIndex = () => 0,
  onProject,
}) {
  if (!host || !canvas || !Array.isArray(items) || !items.length || !supportsTechnical3D()) {
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 2400);
  const root = new THREE.Group();
  const lineRoot = new THREE.Group();
  const packetRoot = new THREE.Group();
  const coreRoot = new THREE.Group();
  const fieldRoot = new THREE.Group();

  root.rotation.order = 'YXZ';
  scene.add(root);
  scene.add(lineRoot);
  scene.add(packetRoot);
  scene.add(coreRoot);
  scene.add(fieldRoot);

  const architecture = createArchitecture({ lightMode, mode, variant: sceneVariant });
  scene.add(architecture.group);

  const grid = new THREE.GridHelper(
    mode === 'home' ? 960 : mode === 'flow' ? 1320 : 720,
    mode === 'home' ? 14 : mode === 'flow' ? 18 : 10,
    lightMode ? '#84d3a6' : '#84d3a6',
    lightMode ? '#1a1d21' : '#d7e2eb'
  );
  grid.position.y = mode === 'home' ? -160 : mode === 'flow' ? -148 : -110;
  setGridOpacity(grid, lightMode ? 0.08 : 0.11);
  root.add(grid);

  const rings = createRings({ lightMode, mode });
  rings.forEach(({ ring }) => {
    coreRoot.add(ring);
  });

  const coreSphere = new THREE.Mesh(
    new THREE.SphereGeometry(mode === 'home' ? 10 : 8, 32, 32),
    new THREE.MeshBasicMaterial({
      color: lightMode ? '#101214' : '#f6f8fb',
      transparent: true,
      opacity: 0.96,
    })
  );
  coreRoot.add(coreSphere);

  const coreHalo = new THREE.Mesh(
    new THREE.SphereGeometry(mode === 'home' ? 26 : 18, 24, 24),
    new THREE.MeshBasicMaterial({
      color: '#84d3a6',
      transparent: true,
      opacity: lightMode ? 0.11 : 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  coreRoot.add(coreHalo);

  const particleField = createParticleField({
    count: mode === 'home' ? 220 : mode === 'flow' ? 320 : 120,
    extent: mode === 'home' ? 1400 : mode === 'flow' ? 1840 : 980,
    lightMode,
  });
  fieldRoot.add(particleField.points);

  const runtimeItems = items.map((item, index) => {
    const color = cssColor(item.color, index % 2 === 0 ? '#84d3a6' : '#92bfff');
    const colorHex = color.getHex();
    const baseAlpha = alphaFromCss(item.color, 1);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(mode === 'home' ? 15 : 11, 20, 20),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: Math.max(lightMode ? 0.08 : 0.12, baseAlpha * 0.12),
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );

    const node = new THREE.Mesh(
      new THREE.SphereGeometry(mode === 'home' ? 4.8 : 3.7, 24, 24),
      new THREE.MeshBasicMaterial({
        color: lightMode ? colorHex : colorHex,
        transparent: true,
        opacity: lightMode ? 0.92 : 1,
      })
    );

    const group = new THREE.Group();
    group.add(glow);
    group.add(node);
    root.add(group);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: lightMode ? 0.1 : 0.22,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    lineRoot.add(line);

    const packet = new THREE.Mesh(
      new THREE.SphereGeometry(mode === 'home' ? 1.9 : 1.4, 16, 16),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.96,
      })
    );
    packetRoot.add(packet);

    return {
      ...item,
      color,
      group,
      glow,
      node,
      line,
      lineGeometry,
      lineMaterial,
      packet,
      baseAlpha,
      packetOffset: item.packetOffset || 0,
      phase: item.phase || index * 0.9,
    };
  });

  let width = 0;
  let height = 0;
  let animationFrame = null;
  let inView = true;
  let lastSizeKey = '';
  const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };

  function resize() {
    const rect = host.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    const key = `${nextWidth}x${nextHeight}`;
    if (key === lastSizeKey) return;

    lastSizeKey = key;
    width = nextWidth;
    height = nextHeight;

    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.fov = mode === 'home'
      ? (width < 720 ? 40 : 33)
      : mode === 'flow'
        ? (width < 720 ? 40 : 31)
        : (width < 420 ? 42 : 36);
    camera.position.set(
      mode === 'home' ? -18 : mode === 'flow' ? -32 : (lightMode ? -6 : 10),
      mode === 'home' ? 68 : mode === 'flow' ? 96 : (lightMode ? 28 : 36),
      mode === 'home' ? 760 : mode === 'flow' ? 920 : 600
    );
    camera.lookAt(
      mode === 'home' ? -28 : mode === 'flow' ? 0 : 24,
      mode === 'home' ? 6 : mode === 'flow' ? 12 : -4,
      0
    );
    camera.updateProjectionMatrix();
  }

  function render(now = 0) {
    if (!width || !height) resize();
    if (!width || !height) return;

    const time = reducedMotion ? 0 : now * 0.001;
    const activeIndex = Math.max(0, Math.min(runtimeItems.length - 1, getActiveIndex()));

    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.06;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.06;

    root.rotation.y = pointer.currentX * 0.34 + Math.sin(time * 0.22) * 0.07;
    root.rotation.x = -0.16 + pointer.currentY * 0.14 + Math.cos(time * 0.18) * 0.04;
    lineRoot.rotation.copy(root.rotation);
    packetRoot.rotation.copy(root.rotation);

    fieldRoot.rotation.y = time * 0.025;
    fieldRoot.rotation.x = -0.1;
    coreRoot.rotation.y = time * 0.12;
    architecture.group.rotation.y = time * (mode === 'flow' ? 0.06 : 0.035);
    architecture.group.rotation.x = -0.04 + Math.cos(time * 0.14) * 0.02;
    architecture.disposables.forEach(({ mesh, baseRotation }, index) => {
      mesh.rotation.y = baseRotation + time * (0.012 + index * 0.003);
    });
    coreHalo.scale.setScalar(1 + Math.sin(time * 1.3) * 0.05);
    rings.forEach(({ ring, baseRotation }, index) => {
      ring.rotation.z = baseRotation + time * (0.08 + index * 0.03);
    });

    const projections = [];

    runtimeItems.forEach((item, index) => {
      const point = {
        x: item.base.x + Math.cos(time * 0.78 + item.phase) * item.drift.x,
        y: item.base.y + Math.sin(time * 0.72 + item.phase) * item.drift.y,
        z: item.base.z + Math.sin(time * 0.58 + item.phase) * item.drift.z,
      };

      const isActive = index === activeIndex;
      const emphasis = isActive ? 1.16 : 1;

      item.group.position.set(point.x, point.y, point.z);
      item.glow.scale.setScalar((isActive ? 1.28 : 1) * (mode === 'home' ? 1.14 : 1));
      item.glow.material.opacity = Math.max(lightMode ? 0.07 : 0.1, item.baseAlpha * (isActive ? 0.2 : 0.12));
      item.node.scale.setScalar(emphasis);

      const positions = item.line.geometry.attributes.position.array;
      positions[0] = 0;
      positions[1] = 0;
      positions[2] = 0;
      positions[3] = point.x;
      positions[4] = point.y;
      positions[5] = point.z;
      item.line.geometry.attributes.position.needsUpdate = true;
      item.lineMaterial.opacity = isActive ? (lightMode ? 0.2 : 0.42) : (lightMode ? 0.08 : 0.2);

      const packetProgress = reducedMotion ? 0.56 : (time * 0.2 + item.packetOffset) % 1;
      item.packet.position.set(point.x * packetProgress, point.y * packetProgress, point.z * packetProgress);
      item.packet.scale.setScalar(isActive ? 1.18 : 1);

      item.group.getWorldPosition(TMP_WORLD);
      const projected = projectToScreen(camera, width, height, TMP_WORLD);
      const distance = camera.position.distanceTo(TMP_WORLD);
      const scale = THREE.MathUtils.clamp((mode === 'home' ? 930 : 760) / distance, mode === 'home' ? 0.58 : 0.62, 1.08);
      const alpha = THREE.MathUtils.clamp(1 - (distance - 260) / 860, 0.28, 1);
      projections.push({
        item,
        projection: {
          x: projected.x,
          y: projected.y,
          scale,
          alpha,
          ndcZ: projected.ndcZ,
        },
      });
    });

    projections.sort((left, right) => left.projection.ndcZ - right.projection.ndcZ);

    const coreProjection = projectToScreen(camera, width, height, ORIGIN);
    onProject?.({
      projections,
      core: coreProjection,
      width,
      height,
    });

    renderer.render(scene, camera);
  }

  function frame(now) {
    animationFrame = globalThis.requestAnimationFrame(frame);
    if (!inView) return;
    render(now);
  }

  function onPointerMove(event) {
    const rect = pointerTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.targetX = THREE.MathUtils.clamp(px, -1, 1);
    pointer.targetY = THREE.MathUtils.clamp(py, -1, 1);
  }

  function onPointerLeave() {
    pointer.targetX = 0;
    pointer.targetY = 0;
  }

  pointerTarget.addEventListener('pointermove', onPointerMove);
  pointerTarget.addEventListener('pointerleave', onPointerLeave);

  const wantsDeviceOrientation = useDeviceOrientation
    && 'DeviceOrientationEvent' in globalThis
    && globalThis.matchMedia?.('(pointer: coarse)').matches === true;

  function onDeviceOrientation(event) {
    if (typeof event.gamma !== 'number' && typeof event.beta !== 'number') return;

    const gamma = THREE.MathUtils.clamp((event.gamma || 0) / 38, -1, 1);
    const beta = THREE.MathUtils.clamp(((event.beta || 0) - 42) / 46, -1, 1);
    pointer.targetX = gamma;
    pointer.targetY = beta;
  }

  if (wantsDeviceOrientation) {
    globalThis.addEventListener('deviceorientation', onDeviceOrientation);
  }

  let resizeObserver = null;
  if ('ResizeObserver' in globalThis) {
    resizeObserver = new ResizeObserver(() => {
      lastSizeKey = '';
      resize();
      render(globalThis.performance?.now?.() || 0);
    });
    resizeObserver.observe(host);
  }

  let intersectionObserver = null;
  if ('IntersectionObserver' in globalThis) {
    intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        inView = entry.isIntersecting;
        if (inView) {
          render(globalThis.performance?.now?.() || 0);
        }
      });
    }, { threshold: 0.01 });
    intersectionObserver.observe(host);
  }

  resize();
  render(0);

  if (!reducedMotion) {
    animationFrame = globalThis.requestAnimationFrame(frame);
  }

  return {
    resize,
    render(now = globalThis.performance?.now?.() || 0) {
      render(now);
    },
    destroy() {
      if (animationFrame) {
        globalThis.cancelAnimationFrame(animationFrame);
      }

      pointerTarget.removeEventListener('pointermove', onPointerMove);
      pointerTarget.removeEventListener('pointerleave', onPointerLeave);
      if (wantsDeviceOrientation) {
        globalThis.removeEventListener('deviceorientation', onDeviceOrientation);
      }
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();

      runtimeItems.forEach(item => {
        item.group.removeFromParent();
        item.line.removeFromParent();
        item.packet.removeFromParent();
        item.glow.geometry.dispose();
        item.glow.material.dispose();
        item.node.geometry.dispose();
        item.node.material.dispose();
        item.lineGeometry.dispose();
        item.lineMaterial.dispose();
        item.packet.geometry.dispose();
        item.packet.material.dispose();
      });

      grid.geometry.dispose();
      const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
      gridMaterials.forEach(material => material.dispose());

      rings.forEach(({ ring, geometry, material }) => {
        ring.removeFromParent();
        geometry.dispose();
        material.dispose();
      });

      architecture.disposables.forEach(({ mesh, geometry, material }) => {
        mesh.removeFromParent();
        geometry.dispose();
        material.dispose();
      });

      coreSphere.geometry.dispose();
      coreSphere.material.dispose();
      coreHalo.geometry.dispose();
      coreHalo.material.dispose();
      particleField.geometry.dispose();
      particleField.material.dispose();
      renderer.dispose();
    },
  };
}

export { supportsTechnical3D };