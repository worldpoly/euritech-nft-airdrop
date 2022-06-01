import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

import { HTMLMesh } from "three/examples/jsm/interactive/HTMLMesh.js";
import { InteractiveGroup } from "three/examples/jsm/interactive/InteractiveGroup.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

import Stats from "three/examples/jsm/libs/stats.module";
import { Timer } from "../components/timer";

export const Room = () => {
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [stats, setStats] = useState<Stats>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 599); // 10min later

  const containerRef = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    } else {
      console.log("renderer || scene || camera is null", renderer);
    }
  }, [renderer, scene, camera]);

  const animate = useCallback(() => {
    //if (stats) {
    requestAnimationFrame(animate);
    render();
    //stats.update();
    //} else {
    // console.log("stats object is null");
    //}
  }, [/* stats,*/ render]);

  useEffect(() => {
    const _scene = new THREE.Scene();

    new RGBELoader().setPath("textures/equirectangular/").load("moonless_golf_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      _scene.background = texture;
      _scene.environment = texture;
    });

    const _camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    _camera.position.set(0, 1.6, 1.5);

    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 50);
    const cylinderMaterial = new THREE.MeshStandardMaterial();
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.z = -2;
    _scene.add(cylinder);

    // lensflare
    const loader = new THREE.TextureLoader();
    const texture0 = loader.load("textures/lensflare/lensflare0.png");
    const texture3 = loader.load("textures/lensflare/lensflare3.png");

    const lensflare = new Lensflare();
    lensflare.position.set(0, 5, -5);
    lensflare.addElement(new LensflareElement(texture0, 700, 0));
    lensflare.addElement(new LensflareElement(texture3, 60, 0.6));
    lensflare.addElement(new LensflareElement(texture3, 70, 0.7));
    lensflare.addElement(new LensflareElement(texture3, 120, 0.9));
    lensflare.addElement(new LensflareElement(texture3, 70, 1));
    _scene.add(lensflare);

    //

    const _reflector = new Reflector(new THREE.PlaneGeometry(2, 2), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    _reflector.position.x = 1;
    _reflector.position.y = 1.5;
    _reflector.position.z = -3;
    _reflector.rotation.y = -Math.PI / 4;
    // TOFIX: Reflector breaks transmission
    // scene.add( reflector );

    const frameGeometry = new THREE.BoxGeometry(2.1, 2.1, 0.1);
    const frameMaterial = new THREE.MeshPhongMaterial();
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.07;
    _reflector.add(frame);

    //

    const _renderer = new THREE.WebGLRenderer({ antialias: true });
    _renderer.autoClear = false;
    _renderer.setPixelRatio(window.devicePixelRatio);
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _renderer.xr.enabled = true;
    document.body.appendChild(_renderer.domElement);

    document.body.appendChild(VRButton.createButton(_renderer));

    // window.addEventListener("resize", onWindowResize);

    //

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);

    const controller1 = _renderer.xr.getController(0);
    controller1.add(new THREE.Line(geometry));
    _scene.add(controller1);

    const controller2 = _renderer.xr.getController(1);
    controller2.add(new THREE.Line(geometry));
    _scene.add(controller2);

    //

    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip1 = _renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    _scene.add(controllerGrip1);

    const controllerGrip2 = _renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    _scene.add(controllerGrip2);

    //document.body.appendChild(_stats.dom);

    const _group = new InteractiveGroup(_renderer, _camera);
    _scene.add(_group);

    const _gui = document.getElementById("canvas-dots");
    console.log("_gui", _gui);

    const mesh = new HTMLMesh(_gui as HTMLElement);
    mesh.position.x = -0.75;
    mesh.position.y = 1.5;
    mesh.position.z = -0.5;
    mesh.rotation.y = Math.PI / 4;
    mesh.scale.setScalar(2);
    _group.add(mesh);

    setScene(_scene);
    //setStats(_stats);
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

  return (
    <>
      <div ref={containerRef} style={{ width: 1000, height: 1000 }}></div>
      <div id="canvas-dots" style={{ width: 100, height: 100, backgroundColor: "red" }}>
        Hello world
      </div>
    </>
  );
};

// <Timer expiryTimestamp={time} onExpire={() => {}} />;
