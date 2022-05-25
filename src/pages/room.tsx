import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";

export const Room = () => {
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [controls, setControls] = useState<OrbitControls>();
  const [stats, setStats] = useState<Stats>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();

  const containerRef = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    } else {
      console.log("renderer && scene && camera is null", renderer);
    }
  }, [renderer, scene, camera]);

  const animate = useCallback(() => {
    if (controls && stats) {
      requestAnimationFrame(animate);

      controls.update();

      render();

      stats.update();
    } else {
      console.log("controls || stats is null");
    }
  }, [controls, stats, render]);

  useEffect(() => {
    const _scene = new THREE.Scene();
    _scene.add(new THREE.AxesHelper(5));

    const light = new THREE.HemisphereLight();
    light.position.set(0.8, 1.4, 1.0);
    _scene.add(light);

    const gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030);
    _scene.add(gridHelper);

    /*const ambientLight = new THREE.SpotLight();
    light.position.set(0.8, 1.4, 1.0);
    _scene.add(ambientLight);*/

    const _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);

    _camera.position.set(2, 18, 28);

    const _renderer = new THREE.WebGLRenderer();
    _renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(_renderer.domElement);

    const _controls = new OrbitControls(_camera, _renderer.domElement);
    _controls.enableDamping = true;
    _controls.target.set(0, 1, 0);

    /*
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "models/SM_HighRise1.FBX",
      (object) => {
        object.traverse(function (child) {
          child = child as THREE.Mesh;
          if ((child as THREE.Mesh).isMesh) {
            // (child as THREE.Mesh).material = material;
            if ((child as THREE.Mesh).material) {
              ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false;
            }

            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).map = new THREE.TextureLoader().load(
              "models/T_TextureAtlas3_Clean_Normal.png"
            );
            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).needsUpdate = true;
          }
        });
        object.scale.set(0.01, 0.01, 0.01);
        _scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
*/

    const loader = new GLTFLoader();
    loader.load(
      "models/SM_HighRise1.gltf",
      function (gltf) {
        gltf.scene.traverse(function (child) {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.receiveShadow = true;
            m.castShadow = true;
          }
          if ((child as THREE.Light).isLight) {
            const l = child as THREE.Light;
            l.castShadow = true;
            l.shadow.bias = -0.003;
            l.shadow.mapSize.width = 2048;
            l.shadow.mapSize.height = 2048;
          }
        });
        _scene.add(gltf.scene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );

    const _stats = Stats();
    document.body.appendChild(_stats.dom);

    setScene(_scene);
    setStats(_stats);
    setControls(_controls);
    setCamera(_camera);
    setRenderer(_renderer);
  }, []);

  useEffect(() => {
    if (scene) {
      animate();
    }
  }, [scene]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
      } else {
        console.log("camera && renderer is null");
      }
    }
  }, []);

  return <div ref={containerRef} style={{ width: 1000, height: 1000 }}></div>;
};
