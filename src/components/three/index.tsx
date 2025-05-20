import { FC, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import s from './index.module.less'

const Three:FC = () => {
  const threeRef = useRef()
  const width = window.innerWidth;
  const height = window.innerHeight;
  let scene:any;
  let camera:any;
  let renderer:any;
  useEffect(() => {
    return () => {
      // 清除代码
      scene.traverse(object => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (object.material.isMaterial) {
          object.material.dispose();
        } else {
          for (const material of object.material) {
            material.dispose();
          }
        }
      });
      renderer.domElement.remove()
      renderer.dispose();
      scene = null
      camera = null
    };
  }, []);

  const init = () => {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)
    
    // 创建相机（透视相机）
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
    camera.position.z = 200;
    // 调整相机位置，确保覆盖模型范围
    // camera.position.set(0, 0, 200); // 初始位置
    camera.lookAt(0, 0, 0);         // 看向场景中心
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // 添加平行光和环境光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 500, 500);
    scene.add(directionalLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
  }
  

  const project = (lng, lat) => {
    const scale = 100;
    const centerLng = 112.97;
    const centerLat = 28.19;
    const x = (lng - centerLng) * scale;
    const y = (lat - centerLat) * scale;
    return new THREE.Vector3(x, -y, 0);
  }

  const loadGeoJSON = () => {
    fetch('changsha.geojson')
      .then(response => response.json())
      .then(data => {
        const features = data.features;
        features.forEach(feature => {
          const coordinates = feature.geometry.coordinates[0][0];
          const points = coordinates.map((coord:any[]) => project(coord[0], coord[1]));
          create3DShape(points);
        });
      });
  }
  
  
  const create3DShape = (points: any[]) => {
    // 创建几何图形
    const shape = new THREE.Shape();
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    // points.slice(1).forEach(point => shape.lineTo(point.x, point.y))

    // 拉伸成3D模型
    const extrudeSettings = { depth: 10, bevelEnabled: true };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({ color: '#fff' });
    const mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);
  }
  
  const animate = () => {
    requestAnimationFrame(animate);
    // scene.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  init()
  loadGeoJSON()
  animate();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
      intersects[0].object.material.color.set('#ff0000'); // 点击变色
    }
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  return (
    <div></div>
  )
}

export default Three
