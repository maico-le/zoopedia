import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Mock DOM elements required by GLTFExporter in Node environment
global.document = {
  createElement: () => ({
    getContext: () => null,
  }),
};

class MockFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buffer).toString('base64');
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
global.FileReader = MockFileReader;

function createTigerAnatomyScene() {
  const scene = new THREE.Scene();
  scene.name = 'Tiger_Anatomy_Scene';

  // 1. Skin Layer (skin_outer)
  const skinGroup = new THREE.Group();
  skinGroup.name = 'skin_outer';

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xdf7218,
    roughness: 0.8,
    metalness: 0.1,
    name: 'mat_skin',
  });

  // Body
  const bodyGeo = new THREE.CapsuleGeometry(0.55, 1.6, 8, 16);
  bodyGeo.rotateZ(Math.PI / 2);
  const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
  bodyMesh.name = 'skin_body';
  bodyMesh.position.set(0, 0.9, 0);
  skinGroup.add(bodyMesh);

  // Head
  const headGeo = new THREE.SphereGeometry(0.42, 16, 12);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.name = 'skin_head';
  headMesh.position.set(1.15, 1.25, 0);
  headMesh.scale.set(1.1, 0.95, 0.9);
  skinGroup.add(headMesh);

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.32, 0.28, 0.3);
  const snoutMesh = new THREE.Mesh(snoutGeo, skinMat);
  snoutMesh.name = 'skin_snout';
  snoutMesh.position.set(1.48, 1.15, 0);
  skinGroup.add(snoutMesh);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.12, 0.22, 5);
  const earL = new THREE.Mesh(earGeo, skinMat);
  earL.position.set(1.15, 1.65, 0.25);
  earL.rotation.z = -0.2;
  const earR = earL.clone();
  earR.position.set(1.15, 1.65, -0.25);
  skinGroup.add(earL, earR);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.9, 8);
  const legPositions = [
    [0.7, 0.45, 0.4],
    [0.7, 0.45, -0.4],
    [-0.7, 0.45, 0.38],
    [-0.7, 0.45, -0.38],
  ];
  legPositions.forEach((pos, i) => {
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.name = `skin_leg_${i}`;
    leg.position.set(...pos);
    skinGroup.add(leg);
  });

  // Tail
  const tailGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.1, 6);
  tailGeo.rotateZ(0.6);
  const tailMesh = new THREE.Mesh(tailGeo, skinMat);
  tailMesh.name = 'skin_tail';
  tailMesh.position.set(-1.3, 0.6, 0);
  skinGroup.add(tailMesh);

  scene.add(skinGroup);

  // 2. Muscle Layer (muscle_body)
  const muscleGroup = new THREE.Group();
  muscleGroup.name = 'muscle_body';

  const muscleMat = new THREE.MeshStandardMaterial({
    color: 0x9e2a2b,
    roughness: 0.6,
    metalness: 0.15,
    name: 'mat_muscle',
  });

  const mBodyGeo = new THREE.CapsuleGeometry(0.48, 1.45, 8, 16);
  mBodyGeo.rotateZ(Math.PI / 2);
  const mBody = new THREE.Mesh(mBodyGeo, muscleMat);
  mBody.position.set(0, 0.9, 0);
  muscleGroup.add(mBody);

  const mHeadGeo = new THREE.SphereGeometry(0.38, 12, 10);
  const mHead = new THREE.Mesh(mHeadGeo, muscleMat);
  mHead.position.set(1.12, 1.25, 0);
  muscleGroup.add(mHead);

  scene.add(muscleGroup);

  // 3. Skeleton Layer
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xe8e6db,
    roughness: 0.4,
    metalness: 0.05,
    name: 'mat_bone',
  });

  // Skull
  const skullGroup = new THREE.Group();
  skullGroup.name = 'bone_skull';
  const skullMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.32), boneMat);
  skullMesh.position.set(1.18, 1.25, 0);
  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.22), boneMat);
  jawMesh.position.set(1.36, 1.12, 0);
  skullGroup.add(skullMesh, jawMesh);
  scene.add(skullGroup);

  // Spine & Ribs
  const spineGroup = new THREE.Group();
  spineGroup.name = 'bone_spine';
  const spineMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), boneMat);
  spineMesh.rotation.z = Math.PI / 2;
  spineMesh.position.set(0, 1.2, 0);
  spineGroup.add(spineMesh);

  // Ribcage
  const ribGeo = new THREE.TorusGeometry(0.35, 0.03, 6, 12);
  ribGeo.rotateY(Math.PI / 2);
  for (let x = -0.4; x <= 0.5; x += 0.18) {
    const rib = new THREE.Mesh(ribGeo, boneMat);
    rib.position.set(x, 0.95, 0);
    spineGroup.add(rib);
  }
  scene.add(spineGroup);

  // 4. Internal Organs (Circulatory, Respiratory, Digestive)
  // Heart
  const heartGroup = new THREE.Group();
  heartGroup.name = 'organ_heart';
  const heartMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.14),
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4, metalness: 0.2, name: 'mat_heart' })
  );
  heartMesh.position.set(0.32, 0.9, 0.05);
  heartGroup.add(heartMesh);
  scene.add(heartGroup);

  // Lungs
  const lungsGroup = new THREE.Group();
  lungsGroup.name = 'organ_lungs';
  const lungMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5, name: 'mat_lungs' });
  const lungGeo = new THREE.CapsuleGeometry(0.12, 0.25, 6, 8);
  lungGeo.rotateZ(Math.PI / 2);

  const lungL = new THREE.Mesh(lungGeo, lungMat);
  lungL.position.set(0.2, 0.96, 0.18);
  const lungR = new THREE.Mesh(lungGeo, lungMat);
  lungR.position.set(0.2, 0.96, -0.18);
  lungsGroup.add(lungL, lungR);
  scene.add(lungsGroup);

  return scene;
}

const scene = createTigerAnatomyScene();
const exporter = new GLTFExporter();

try {
  const gltf = await exporter.parseAsync(scene, { binary: true });
  const outputPath = path.resolve('public/models/panthera-tigris-anatomy.glb');
  fs.writeFileSync(outputPath, Buffer.from(gltf));
  console.log(`✅ Generated anatomical model: ${outputPath} (${(gltf.byteLength / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Error exporting GLB:', err);
  process.exit(1);
}
