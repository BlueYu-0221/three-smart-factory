import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// ==================== 场景初始化 ====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 100, 300);

// 相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(60, 50, 60);

// WebGL渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('app').appendChild(renderer.domElement);

// CSS2D渲染器（用于3D标签）
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('app').appendChild(labelRenderer.domElement);

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minDistance = 20;
controls.maxDistance = 150;
controls.target.set(0, 0, 0);

// ==================== 光照系统 ====================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 80, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 200;
scene.add(directionalLight);

// ==================== 地面（草地） ====================
function createGround() {
  const groundGeometry = new THREE.PlaneGeometry(300, 300);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7CB342 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

// ==================== 道路系统 ====================
function createRoad() {
  const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // 主道路（横向）
  const road1 = new THREE.Mesh(new THREE.PlaneGeometry(120, 10), roadMaterial);
  road1.rotation.x = -Math.PI / 2;
  road1.position.set(0, 0.02, 25);
  road1.receiveShadow = true;
  scene.add(road1);

  // 右侧道路（纵向）
  const road2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 80), roadMaterial);
  road2.rotation.x = -Math.PI / 2;
  road2.position.set(55, 0.02, -10);
  road2.receiveShadow = true;
  scene.add(road2);

  // 道路虚线 - 横向
  for (let i = -50; i < 60; i += 8) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), lineMaterial);
    line.rotation.x = -Math.PI / 2;
    line.position.set(i, 0.03, 25);
    scene.add(line);
  }
  // 道路虚线 - 纵向
  for (let i = -40; i < 30; i += 8) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 3), lineMaterial);
    line.rotation.x = -Math.PI / 2;
    line.position.set(55, 0.03, i);
    scene.add(line);
  }

  // 厂区水泥地面
  const yardGeometry = new THREE.PlaneGeometry(80, 50);
  const yardMaterial = new THREE.MeshLambertMaterial({ color: 0x9E9E9E });
  const yard = new THREE.Mesh(yardGeometry, yardMaterial);
  yard.rotation.x = -Math.PI / 2;
  yard.position.set(-5, 0.01, -5);
  yard.receiveShadow = true;
  scene.add(yard);
}

// ==================== 厂房建筑 ====================
function createFactory() {
  const group = new THREE.Group();

  // 墙体（米黄色）
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFF8E1 });
  const wallGeometry = new THREE.BoxGeometry(50, 12, 30);
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(-10, 6, -10);
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // 屋顶（蓝色）
  const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x1565C0 });
  // 平屋顶部分
  const roofFlat = new THREE.Mesh(new THREE.BoxGeometry(50, 0.6, 20), roofMaterial);
  roofFlat.position.set(-10, 12.3, -5);
  roofFlat.castShadow = true;
  roofFlat.receiveShadow = true;
  group.add(roofFlat);
  // 斜屋顶部分
  const roofSlope = new THREE.Mesh(new THREE.BoxGeometry(50, 0.6, 14), roofMaterial);
  roofSlope.position.set(-10, 15, -22);
  roofSlope.rotation.x = -0.45;
  roofSlope.castShadow = true;
  roofSlope.receiveShadow = true;
  group.add(roofSlope);

  // 窗户（浅蓝色）
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x81D4FA });
  // 正面窗户
  for (let i = -20; i <= 15; i += 5) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 0.2), windowMaterial);
    win.position.set(i, 7, 5.1);
    group.add(win);
  }
  // 背面窗户
  for (let i = -20; i <= 15; i += 5) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 0.2), windowMaterial);
    win.position.set(i, 7, -25.1);
    group.add(win);
  }

  // 门（棕色）
  const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xBCAAA4 });
  const door1 = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.3), doorMaterial);
  door1.position.set(-5, 2.5, 5.15);
  group.add(door1);
  const door2 = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.3), doorMaterial);
  door2.position.set(10, 2.5, 5.15);
  group.add(door2);
  const door3 = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.3), doorMaterial);
  door3.position.set(-20, 2.5, -25.15);
  group.add(door3);

  scene.add(group);
  return group;
}

// ==================== 储罐设备 ====================
function createTank(x, z, labelText) {
  const group = new THREE.Group();

  // 罐体（深灰色）
  const tankMaterial = new THREE.MeshLambertMaterial({ color: 0x424242 });
  const tankGeometry = new THREE.CylinderGeometry(6, 6, 10, 32);
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.position.set(0, 5, 0);
  tank.castShadow = true;
  tank.receiveShadow = true;
  group.add(tank);

  // 罐顶
  const topGeometry = new THREE.CylinderGeometry(6.3, 6.3, 0.6, 32);
  const topMaterial = new THREE.MeshLambertMaterial({ color: 0x616161 });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.set(0, 10.3, 0);
  top.castShadow = true;
  group.add(top);

  // 蓝色管道
  const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
  const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 16), pipeMaterial);
  pipe1.position.set(3, 9, 0);
  pipe1.rotation.z = Math.PI / 6;
  pipe1.castShadow = true;
  group.add(pipe1);

  const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 16), pipeMaterial);
  pipe2.position.set(5, 7, 2);
  pipe2.rotation.x = Math.PI / 2;
  pipe2.castShadow = true;
  group.add(pipe2);

  // 爬梯
  const ladderMaterial = new THREE.MeshLambertMaterial({ color: 0x795548 });
  for (let i = 0; i < 8; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), ladderMaterial);
    step.position.set(-6.2, 1 + i * 1.2, 0);
    group.add(step);
  }
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 10, 0.15), ladderMaterial);
  rail1.position.set(-6.2, 5, 0.7);
  group.add(rail1);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 10, 0.15), ladderMaterial);
  rail2.position.set(-6.2, 5, -0.7);
  group.add(rail2);

  group.position.set(x, 0, z);

  // 3D标签
  const labelDiv = document.createElement('div');
  labelDiv.className = 'label';
  labelDiv.textContent = labelText;
  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 14, 0);
  group.add(label);

  scene.add(group);
  return group;
}

// ==================== 水池（带Shader波纹动画） ====================
function createPool() {
  const group = new THREE.Group();

  // 池壁（灰色水泥）
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xE0E0E0 });
  const poolWall = new THREE.Mesh(new THREE.BoxGeometry(22, 2, 16), wallMaterial);
  poolWall.position.set(0, 1, 0);
  poolWall.castShadow = true;
  poolWall.receiveShadow = true;
  group.add(poolWall);

  // 池内深色
  const inner = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.5, 14),
    new THREE.MeshBasicMaterial({ color: 0x0D47A1 })
  );
  inner.position.set(0, 1.8, 0);
  group.add(inner);

  // 水面Shader - 双层正弦波实现波纹效果
  const waterGeometry = new THREE.PlaneGeometry(20, 14, 32, 32);
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(0x29B6F6) }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // 双层波纹叠加
        float wave = sin(pos.x * 0.5 + time * 2.0) * cos(pos.y * 0.5 + time * 1.5) * 0.15;
        wave += sin(pos.x * 0.3 + time * 3.0) * cos(pos.y * 0.4 + time * 2.0) * 0.1;
        pos.z += wave;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        // 根据波纹高度改变亮度
        float intensity = 0.7 + vWave * 2.0;
        gl_FragColor = vec4(baseColor * intensity, 0.92);
      }
    `,
    transparent: true
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 2.05, 0);
  group.add(water);

  group.position.set(35, 0, -15);
  scene.add(group);

  return { group, waterMaterial };
}

// ==================== 树木生成 ====================
function createTree(x, z, scale = 1) {
  const group = new THREE.Group();

  // 树干（棕色）
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x795548 });
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 2.5 * scale, 8),
    trunkMaterial
  );
  trunk.position.y = 1.25 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  // 树叶（绿色，多个球体组合）
  const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
  const leaves1 = new THREE.Mesh(new THREE.SphereGeometry(1.6 * scale, 8, 8), leafMaterial);
  leaves1.position.y = 3.5 * scale;
  leaves1.castShadow = true;
  group.add(leaves1);

  const leaves2 = new THREE.Mesh(new THREE.SphereGeometry(1.2 * scale, 8, 8), leafMaterial);
  leaves2.position.set(0.9 * scale, 2.8 * scale, 0.3 * scale);
  leaves2.castShadow = true;
  group.add(leaves2);

  const leaves3 = new THREE.Mesh(new THREE.SphereGeometry(1.1 * scale, 8, 8), leafMaterial);
  leaves3.position.set(-0.7 * scale, 3.1 * scale, 0.7 * scale);
  leaves3.castShadow = true;
  group.add(leaves3);

  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function createTrees() {
  // 道路两侧行道树
  for (let i = -50; i < 60; i += 6) {
    createTree(i, 18, 0.8 + Math.random() * 0.4);
    createTree(i, 32, 0.8 + Math.random() * 0.4);
  }
  for (let i = -40; i < 30; i += 6) {
    createTree(48, i, 0.8 + Math.random() * 0.4);
    createTree(62, i, 0.8 + Math.random() * 0.4);
  }
  // 厂区周围绿化
  for (let i = -40; i < 30; i += 7) {
    createTree(i, -30, 1 + Math.random() * 0.3);
  }
  // 远景随机树木
  for (let i = 0; i < 40; i++) {
    const x = -90 + Math.random() * 180;
    const z = -90 + Math.random() * 180;
    if (Math.abs(x) > 50 || Math.abs(z) > 40) {
      createTree(x, z, 0.7 + Math.random() * 0.6);
    }
  }
}

// ==================== 卡车模型 ====================
function createTruck(x, z, rotation = 0) {
  const group = new THREE.Group();

  // 车头（黑色）
  const cabMaterial = new THREE.MeshLambertMaterial({ color: 0x303030 });
  const cab = new THREE.Mesh(new THREE.BoxGeometry(3, 3.2, 2.8), cabMaterial);
  cab.position.set(-4, 2.1, 0);
  cab.castShadow = true;
  group.add(cab);

  // 车厢（灰色）
  const trailerMaterial = new THREE.MeshLambertMaterial({ color: 0xBDBDBD });
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 3), trailerMaterial);
  trailer.position.set(2, 2, 0);
  trailer.castShadow = true;
  group.add(trailer);

  // 车轮（黑色）
  const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x212121 });
  const wheelPositions = [
    [-5, 0.8, 1.5], [-5, 0.8, -1.5],
    [-2, 0.8, 1.5], [-2, 0.8, -1.5],
    [4, 0.8, 1.5], [4, 0.8, -1.5]
  ];
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16), wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(pos[0], pos[1], pos[2]);
    group.add(wheel);
  });

  group.position.set(x, 0, z);
  group.rotation.y = rotation;
  scene.add(group);
  return group;
}

// ==================== 国旗（带Shader飘动动画） ====================
function createFlag() {
  const group = new THREE.Group();

  // 旗杆（银色金属）
  const poleMaterial = new THREE.MeshLambertMaterial({ color: 0xBDBDBD });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 15, 16), poleMaterial);
  pole.position.y = 7.5;
  pole.castShadow = true;
  group.add(pole);

  // 旗杆顶部球
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0xFFD700 })
  );
  ball.position.y = 15.1;
  group.add(ball);

  // 旗帜Shader - 固定旗杆侧，自由侧波动更大
  const flagGeometry = new THREE.PlaneGeometry(4, 2.7, 24, 12);
  const flagMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // 波动幅度随x增大（固定左侧旗杆）
        float waveFactor = uv.x;
        float wave = sin(pos.x * 2.0 + time * 3.0) * waveFactor * 0.4;
        wave += sin(pos.x * 3.5 + time * 4.5) * waveFactor * 0.2;
        pos.z += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        vec3 red = vec3(0.87, 0.1, 0.1);
        vec3 yellow = vec3(1.0, 0.87, 0.0);
        
        // 大五角星位置
        vec2 star1Pos = vec2(0.2, 0.72);
        float star1 = 1.0 - smoothstep(0.0, 0.07, distance(vUv, star1Pos));
        
        vec3 color = red;
        color = mix(color, yellow, star1 * 0.9);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(2.05, 13.2, 0);
  group.add(flag);

  // 旗台（灰色水泥）
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.6, 2.5),
    new THREE.MeshLambertMaterial({ color: 0x757575 })
  );
  base.position.y = 0.3;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  group.position.set(-40, 0, 10);
  scene.add(group);

  return { group, flagMaterial };
}

// ==================== 相机视角切换（带缓动动画） ====================
const cameraViews = {
  home: {
    pos: { x: 60, y: 50, z: 60 },
    target: { x: 0, y: 0, z: 0 }
  },
  deviceA: {
    pos: { x: 48, y: 22, z: -8 },
    target: { x: 30, y: 6, z: -25 }
  },
  deviceB: {
    pos: { x: 22, y: 20, z: -12 },
    target: { x: 20, y: 6, z: -20 }
  }
};

let isFlying = false;
let flyProgress = 0;
const startPos = new THREE.Vector3();
const endPos = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const endTarget = new THREE.Vector3();

function flyToView(viewName) {
  if (isFlying) return;
  const view = cameraViews[viewName];
  if (!view) return;

  // 更新按钮active状态
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.target === viewName) {
      btn.classList.add('active');
    }
  });

  startPos.copy(camera.position);
  endPos.set(view.pos.x, view.pos.y, view.pos.z);
  startTarget.copy(controls.target);
  endTarget.set(view.target.x, view.target.y, view.target.z);
  flyProgress = 0;
  isFlying = true;
}

// 绑定按钮点击事件
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    flyToView(btn.dataset.target);
  });
});

// ==================== 场景初始化 ====================
createGround();
createRoad();
createFactory();
createTank(30, -25, '设备A');
createTank(20, -20, '设备B');
const poolData = createPool();
createTrees();
createTruck(-20, 15, 0);
createTruck(-10, 10, Math.PI);
createTruck(-25, 8, 0.2);
const flagData = createFlag();

// 厂房标签
const factoryLabelDiv = document.createElement('div');
factoryLabelDiv.className = 'label';
factoryLabelDiv.textContent = '厂房C';
const factoryLabel = new CSS2DObject(factoryLabelDiv);
factoryLabel.position.set(-10, 21, -10);
scene.add(factoryLabel);

// ==================== 窗口大小自适应 ====================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ==================== 主渲染循环 ====================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // 相机飞行动画 - 使用easeOutCubic缓动
  if (isFlying) {
    flyProgress += delta * 0.7;
    if (flyProgress >= 1) {
      flyProgress = 1;
      isFlying = false;
    }
    const t = 1 - Math.pow(1 - flyProgress, 3);
    camera.position.lerpVectors(startPos, endPos, t);
    controls.target.lerpVectors(startTarget, endTarget, t);
  }

  // 更新Shader动画时间
  poolData.waterMaterial.uniforms.time.value = elapsedTime;
  flagData.flagMaterial.uniforms.time.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

console.log('智慧工厂3D场景初始化完成！');
