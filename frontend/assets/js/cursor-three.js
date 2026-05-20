(function () {
  window.addEventListener('DOMContentLoaded', () => {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let mx = innerWidth / 2,
      my = innerHeight / 2;
    window.addEventListener(
      'pointermove',
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        glow.style.left = mx + 'px';
        glow.style.top = my + 'px';
      },
      { passive: true }
    );
    if (!window.THREE) return;
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 6;
    const geo = new THREE.BufferGeometry();
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x1e9d5c,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    function resize() {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    let t = 0;
    function loop() {
      requestAnimationFrame(loop);
      t += 0.004;
      pts.rotation.y = t * 0.7;
      pts.rotation.x = Math.sin(t * 0.5) * 0.15;
      renderer.render(scene, camera);
    }
    loop();
  });
})();
