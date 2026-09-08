'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ScrollRotatingLogo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // 2. WebGL Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.setClearColor(0x000000, 0); // Pure transparent background

    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig for Rich Metallic & Crimson Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    // Key light (warm golden shine from top-right)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Fill light (cool sky tone from bottom-left)
    const fillLight = new THREE.DirectionalLight(0xddeeff, 2.0);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // Rim light from behind for silhouette bevel separation
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Front specular sparkle
    const pointLight = new THREE.PointLight(0xffffff, 1.8, 10);
    pointLight.position.set(0, 0, 3.5);
    scene.add(pointLight);

    // 4. Pivot Group for Perfectly Centered Rotation
    const pivot = new THREE.Group();
    pivot.position.y = 0;
    scene.add(pivot);

    let modelMesh: THREE.Group | null = null;

    // 5. Load GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/LogoTamanSanjaya.glb',
      (gltf) => {
        modelMesh = gltf.scene;

        // Auto-center the model geometry inside pivot
        const box = new THREE.Box3().setFromObject(modelMesh);
        const center = box.getCenter(new THREE.Vector3());
        modelMesh.position.sub(center);

        // Adjust scale appropriately
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.2 / (maxDim || 1);
        pivot.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Enhance material aesthetics (double-sided, glossy metal & lacquer)
        modelMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.side = THREE.DoubleSide;
              mat.roughness = Math.min(mat.roughness ?? 0.35, 0.4);
              mat.metalness = Math.max(mat.metalness ?? 0.3, 0.4);
              mat.needsUpdate = true;
            }
          }
        });

        pivot.add(modelMesh);
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Error loading Logo GLB model:', err);
      }
    );

    // 6. Smooth Physics Tracking (Scroll & Mouse)
    let targetRotY = 0;
    let currentRotY = 0;

    let targetRotX = 0;
    let currentRotX = 0;

    let targetY = 0;
    let currentY = 0;

    let mouseX = 0;
    let mouseY = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const projectEl = document.getElementById('project');

      if (projectEl) {
        const rect = projectEl.getBoundingClientRect();
        // Model 3D mulai aktif saat pengguna scroll mencapai area Koleksi Proyek
        const inProjectZone = rect.top <= window.innerHeight * 0.75;
        setIsVisible(inProjectZone);

        if (inProjectZone) {
          const projectPageTop = projectEl.offsetTop;
          const scrollFromProject = Math.max(0, scrollY - (projectPageTop - window.innerHeight * 0.5));
          const totalRemaining = Math.max(
            document.documentElement.scrollHeight - (projectPageTop - window.innerHeight * 0.5) - window.innerHeight,
            1
          );
          const progress = Math.min(Math.max(scrollFromProject / totalRemaining, 0), 1);

          // Rotasi anggun selama berada di seksi proyek hingga bawah
          targetRotY = progress * Math.PI * 2.5;
          targetY = (progress - 0.5) * -0.3;
        } else {
          targetRotY = 0;
          targetY = 0.2;
        }
      } else {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        setIsVisible(progress > 0.25);
        targetRotY = progress * Math.PI * 2;
        targetY = (progress - 0.5) * -0.35;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Subtle 3D tilt towards mouse cursor
      targetRotX = mouseY * 0.15;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    onScroll(); // initial check

    // 7. Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 8. 60 FPS Render Loop with Inertial Spring Physics
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth interpolation (lerp) for buttery luxury motion
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentY += (targetY - currentY) * 0.04;

      // Subtle organic hover float
      const elapsed = clock.getElapsedTime();
      const idleFloat = Math.sin(elapsed * 1.2) * 0.04;

      // Apply horizontal rotation and vertical drift to 3D pivot
      pivot.rotation.y = currentRotY;
      pivot.rotation.x = currentRotX + 0.05; // Slight fixed tilt to show 3D bevels
      pivot.position.y = currentY + idleFloat;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center"
    >
      {/* 3D WebGL Canvas Container: hanya muncul saat scroll sampai di Koleksi Proyek */}
      <div
        ref={containerRef}
        className={`w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] transition-all duration-700 ease-out ${
          isLoaded && isVisible
            ? 'opacity-[0.25] sm:opacity-[0.30] scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          filter: 'drop-shadow(0 25px 35px rgba(92, 64, 51, 0.35))',
        }}
      />
    </div>
  );
}
