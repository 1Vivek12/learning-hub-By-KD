import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/theme/ThemeContext';

export const ThreeHeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 580;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear old canvases if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting based on Theme
    const ambientColor = isDark ? 0x0f172a : 0xf8fafc;
    const ambientLight = new THREE.AmbientLight(ambientColor, isDark ? 1.5 : 2.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x4f46e5, isDark ? 2.4 : 1.8);
    mainLight.position.set(5, 8, 7);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(isDark ? 0x10b981 : 0x06b6d4, isDark ? 3 : 2, 20);
    accentLight.position.set(-6, -3, 5);
    scene.add(accentLight);

    const rimLight = new THREE.PointLight(isDark ? 0xa855f7 : 0xec4899, isDark ? 2.5 : 1.5, 20);
    rimLight.position.set(6, -4, 4);
    scene.add(rimLight);

    // 4. Objects Group for global mouse tilt
    const group = new THREE.Group();
    scene.add(group);

    // --- Object A: Floating 3D Excel / Analytics Matrix Plane ---
    const gridGeometry = new THREE.PlaneGeometry(7.5, 5, 15, 10);
    const gridMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x059669 : 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.22,
      roughness: 0.2,
      metalness: 0.8,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.position.set(-1.8, -0.6, -1);
    gridMesh.rotation.x = -Math.PI / 3.2;
    gridMesh.rotation.z = Math.PI / 10;
    group.add(gridMesh);

    // --- Object B: 3D SQL Cylinder Data Discs (Database Stack) ---
    const cylinderGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.28, 32);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0284c7 : 0x2563eb,
      metalness: 0.9,
      roughness: 0.2,
      emissive: isDark ? 0x0369a1 : 0x1d4ed8,
      emissiveIntensity: isDark ? 0.25 : 0.1,
    });

    const dbGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const disc = new THREE.Mesh(cylinderGeo, cylinderMat);
      disc.position.y = i * 0.42;
      dbGroup.add(disc);
    }
    dbGroup.position.set(3.8, 1.2, 0);
    dbGroup.rotation.x = 0.4;
    dbGroup.rotation.y = -0.5;
    group.add(dbGroup);

    // --- Object C: 3D Holographic Power BI Analytics Bar Pillars ---
    const barGroup = new THREE.Group();
    const barHeights = [1.2, 2.4, 1.8, 3.2, 2.1, 3.8];
    const barColors = [0x10b981, 0x06b6d4, 0x3b82f6, 0x6366f1, 0x8b5cf6, 0x10b981];

    barHeights.forEach((h, idx) => {
      const barGeo = new THREE.BoxGeometry(0.38, h, 0.38);
      const barMat = new THREE.MeshStandardMaterial({
        color: barColors[idx % barColors.length],
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.88,
        emissive: barColors[idx % barColors.length],
        emissiveIntensity: isDark ? 0.35 : 0.15,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((idx - 2.5) * 0.65, h / 2 - 1.8, 0.8);
      barGroup.add(bar);
    });
    barGroup.position.set(0.6, -0.4, 1.2);
    barGroup.rotation.y = 0.3;
    group.add(barGroup);

    // --- Object D: Floating Tech Torus Orbit (AI Automation Loop) ---
    const torusGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x6366f1,
      transparent: true,
      opacity: isDark ? 0.5 : 0.35,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-3.2, 1.5, -0.5);
    torusMesh.rotation.x = Math.PI / 4;
    group.add(torusMesh);

    // --- Object E: 3D Data Particles Cloud ---
    const particleCount = window.innerWidth < 768 ? 80 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x4f46e5,
      size: 0.08,
      transparent: true,
      opacity: isDark ? 0.7 : 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0008;
      mouseY = (event.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = targetX * 1.5 + Math.sin(elapsedTime * 0.2) * 0.05;
      group.rotation.x = targetY * 1.5 + Math.cos(elapsedTime * 0.15) * 0.04;

      // Organic Floating Oscillations
      dbGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.2) * 0.15;
      dbGroup.rotation.y = -0.5 + elapsedTime * 0.3;

      barGroup.position.y = -0.4 + Math.cos(elapsedTime * 0.9) * 0.1;

      torusMesh.rotation.z = elapsedTime * 0.25;
      torusMesh.rotation.y = elapsedTime * 0.15;

      gridMesh.rotation.z = Math.PI / 10 + Math.sin(elapsedTime * 0.5) * 0.03;

      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 580;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      // Dispose resources
      gridGeometry.dispose();
      gridMaterial.dispose();
      cylinderGeo.dispose();
      cylinderMat.dispose();
      barGroup.children.forEach((c) => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose();
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else c.material.dispose();
        }
      });
      torusGeo.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      id="three-hero-canvas-container"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    />
  );
};
