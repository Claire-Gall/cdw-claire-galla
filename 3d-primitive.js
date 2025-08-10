// rotating-primitives.js
// Three.js scene: rotating black tubes with dramatic lighting and blue fog

(function() {
  // Scene, camera, renderer setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 800 / 400, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(600, 250);
  renderer.setClearColor(0xe6f3ff); // Background matches fog color

  document.getElementById('p5js-container2').appendChild(renderer.domElement);

  // Add light pastel blue fog
  scene.fog = new THREE.Fog(0xe6f3ff, 3, 15);

  // Simple dramatic lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // Function to create a tube along a path
  function createTube(offsetX, offsetY, offsetZ) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 2, 0),
      new THREE.Vector3(2, 0, 1),
      new THREE.Vector3(3, 2, 2)
    ]);

    const geometry = new THREE.TubeGeometry(path, 64, 0.3, 8, false);
    const material = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5, metalness: 0.3 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(offsetX, offsetY, offsetZ);
    return mesh;
  }

  // Create three tubes
  const tube1 = createTube(-4, 1, 2);
  const tube2 = createTube(0, 2.5, 4);
  const tube3 = createTube(6, 4, 6);

  scene.add(tube1, tube2, tube3);

  // Camera position for good view of all objects
  camera.position.set(-10, 8, 4);
  camera.lookAt(0, 2, 0);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 8;
  controls.maxDistance = 40;
  controls.target.set(0, 2, 0);

  // Animation loop (all tubes same rotation)
  function animate() {
    requestAnimationFrame(animate);

    [tube1, tube2, tube3].forEach(tube => {
      tube.rotation.y += 0.03;
      tube.rotation.x += 0.015;
    });

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();