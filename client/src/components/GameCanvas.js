import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/gameStore';

export default function GameCanvas() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playerRef = useRef(null);

  const { playerPosition, updatePosition, players } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Player cube
    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.castShadow = true;
    player.receiveShadow = true;
    scene.add(player);
    playerRef.current = player;

    // Add some buildings
    for (let i = 0; i < 10; i++) {
      const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(
        (Math.random() - 0.5) * 200,
        10,
        (Math.random() - 0.5) * 200
      );
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update player position
      if (playerRef.current) {
        playerRef.current.position.copy(new THREE.Vector3(
          playerPosition.x / 100,
          1,
          playerPosition.z / 100
        ));
      }

      // Update camera to follow player
      if (playerRef.current) {
        camera.position.lerp(
          new THREE.Vector3(
            playerRef.current.position.x,
            playerRef.current.position.y + 5,
            playerRef.current.position.z + 10
          ),
          0.1
        );
        camera.lookAt(playerRef.current.position);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [playerPosition]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
