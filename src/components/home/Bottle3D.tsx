'use client';
import { useEffect, useRef } from 'react';
import Reveal from '@/components/ui/Reveal';
import { BOTTLE } from './bottle-data';
import styles from './Bottle3D.module.css';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Interactive canister built from the real product photos with three.js.
 * - The body is true 3D, wrapped in the actual printed label (unwrapped from the photos).
 * - The red cap, with its mask, wings, nose notch and tab, is the real photographs, shown from
 *   four sides and cross-faded as you turn the can (a turntable), so it looks exactly like the product.
 * Drag to turn; release and it keeps spinning gently.
 */
export default function Bottle3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;
    let teardown: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import('three');
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
        if (disposed) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const { bodyH, capViews } = BOTTLE;
        const capH = Math.max(...capViews.map((v) => v.h));
        const total = bodyH + capH;
        const yBottom = -total / 2; // everything is centred on the origin
        const capBase = yBottom + bodyH; // the cap sits on top of the body

        // --- Renderer, scene, camera ---
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping; // keep the photographed colours as they are
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environmentIntensity = 0.3;
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

        // --- Load the real label and the four cap photographs ---
        const loader = new THREE.TextureLoader();
        const [label, ...capTextures] = await Promise.all([
          loader.loadAsync(`${BASE}/assets/brand/3d/label.jpg`),
          ...capViews.map((v) => loader.loadAsync(`${BASE}/assets/brand/3d/${v.file}`)),
        ]);
        if (disposed) {
          [label, ...capTextures].forEach((t) => t.dispose());
          renderer.dispose();
          return;
        }
        const aniso = renderer.capabilities.getMaxAnisotropy();
        label.colorSpace = THREE.SRGBColorSpace;
        label.anisotropy = aniso;
        capTextures.forEach((t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = aniso;
        });

        // --- Body: a cylinder wrapped in the unwrapped label ---
        const bodyGeo = new THREE.CylinderGeometry(1, 1, bodyH, 160, 1, true);
        const bodyMat = new THREE.MeshStandardMaterial({ map: label, roughness: 0.55, metalness: 0.05 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = yBottom + bodyH / 2;
        body.rotation.y = -Math.PI / 3; // the wordmark panel sits at 60° in the texture; bring it to the front

        const baseGeo = new THREE.CircleGeometry(1, 96);
        const baseMat = new THREE.MeshStandardMaterial({ color: '#cfd0d4', roughness: 0.35, metalness: 0.8 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.rotation.x = Math.PI / 2;
        base.position.y = yBottom;

        const pivot = new THREE.Group();
        pivot.add(body, base);
        scene.add(pivot);

        // --- Cap: one flat picture per photographed side, always facing the camera ---
        const capMats: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
        const capGeos: InstanceType<typeof THREE.PlaneGeometry>[] = [];
        capViews.forEach((v, i) => {
          const geo = new THREE.PlaneGeometry(v.w, v.h);
          const mat = new THREE.MeshBasicMaterial({
            map: capTextures[i],
            transparent: true,
            depthWrite: false,
            opacity: 0,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(v.shiftX, capBase + v.h / 2, 0.05);
          mesh.renderOrder = 2;
          scene.add(mesh);
          capGeos.push(geo);
          capMats.push(mat);
        });

        // Cross-fade between the two nearest photographed sides for the current turn angle.
        const setCapView = (angle: number) => {
          const deg = ((((angle * 180) / Math.PI) % 360) + 360) % 360;
          const n = capViews.length;
          const f = deg / (360 / n); // capViews are evenly spaced: 0, 90, 180, 270
          const i = Math.floor(f) % n;
          const t = smooth(Math.min(1, Math.max(0, (f - Math.floor(f) - 0.4) / 0.2))); // quick swap, so each real photo is held
          capMats.forEach((m, k) => {
            m.opacity = k === i ? 1 - t : k === (i + 1) % n ? t : 0;
          });
        };

        // --- Lights: soft and even, so the photographed label keeps its real look ---
        scene.add(new THREE.HemisphereLight('#ffffff', '#c9ccd6', 1.5));
        const key = new THREE.DirectionalLight('#ffffff', 1.1);
        key.position.set(3, 5, 8);
        scene.add(key);

        // --- Sizing: fit the whole can (tall) and the cap width in any stage shape ---
        const resize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const half = Math.tan((camera.fov * Math.PI) / 360);
          const needH = total + 1.6;
          const needW = 3.6;
          camera.position.set(0, 0, Math.max(needH / (2 * half), needW / (2 * half * camera.aspect)));
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // --- Drag to turn, with inertia ---
        let angle = 0.0;
        let velocity = 0;
        let dragging = false;
        let lastX = 0;
        const el = renderer.domElement;
        const onDown = (e: PointerEvent) => {
          dragging = true;
          lastX = e.clientX;
          el.setPointerCapture(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          angle += dx * 0.011;
          velocity = dx * 0.011;
        };
        const onUp = (e: PointerEvent) => {
          dragging = false;
          if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);

        const tick = () => {
          if (!dragging) {
            angle += velocity;
            velocity *= 0.93;
            if (!reduceMotion) angle += 0.0035;
          }
          pivot.rotation.y = angle;
          setCapView(angle);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        tick();

        teardown = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerup', onUp);
          el.removeEventListener('pointercancel', onUp);
          [bodyGeo, baseGeo, ...capGeos].forEach((g) => g.dispose());
          [bodyMat, baseMat, ...capMats].forEach((m) => m.dispose());
          [label, ...capTextures].forEach((t) => t.dispose());
          pmrem.dispose();
          renderer.dispose();
          el.remove();
        };
      } catch (err) {
        console.error('3D viewer could not start', err);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      teardown?.();
    };
  }, []);

  return (
    <section id="view" className={styles.section} aria-labelledby="bottle-3d-title">
      <div className="ds-container">
        <Reveal className={styles.head}>
          <span className={styles.label}>See it up close</span>
          <h2 id="bottle-3d-title" className={styles.title}>
            Feel it before <span>you order one.</span>
          </h2>
        </Reveal>

        <Reveal>
          <div
            ref={mountRef}
            className={styles.stage}
            role="img"
            aria-label="breathEN canister in 3D. Drag to turn it."
          />
          <p className={styles.hint}>Drag to turn</p>
        </Reveal>
      </div>
    </section>
  );
}
