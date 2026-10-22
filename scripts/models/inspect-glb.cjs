/**
 * scripts/models/inspect-glb.cjs
 * Inspects a GLB file and prints its scene hierarchy, node names, meshes,
 * animations, materials, and size metrics.
 */
const fs = require('fs');
const path = require('path');

function inspectGlb(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);

  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546c67) {
    console.error('Error: Not a valid GLB binary file (magic mismatch).');
    process.exit(1);
  }

  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);
  const jsonChunkLength = buffer.readUInt32LE(12);
  const jsonChunkType = buffer.readUInt32LE(16);

  if (jsonChunkType !== 0x4e4f534a) {
    console.error('Error: First chunk is not JSON chunk.');
    process.exit(1);
  }

  const jsonString = buffer.toString('utf-8', 20, 20 + jsonChunkLength);
  const gltf = JSON.parse(jsonString);

  console.log('====================================================');
  console.log(`GLB Inspector: ${path.basename(filePath)}`);
  console.log(`Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB (${stat.size} bytes)`);
  console.log(`glTF Version: ${version}`);
  console.log('====================================================');

  const nodes = gltf.nodes || [];
  const meshes = gltf.meshes || [];
  const animations = gltf.animations || [];
  const materials = gltf.materials || [];

  console.log(`\n📦 Nodes (${nodes.length}):`);
  nodes.forEach((node, idx) => {
    const meshInfo = node.mesh !== undefined ? `[Mesh #${node.mesh}: ${meshes[node.mesh]?.name || 'unnamed'}]` : '';
    const childrenInfo = node.children ? `-> Children: [${node.children.join(', ')}]` : '';
    console.log(`  #${idx}: "${node.name || 'unnamed'}" ${meshInfo} ${childrenInfo}`);
  });

  if (animations.length > 0) {
    console.log(`\n🎬 Animations (${animations.length}):`);
    animations.forEach((anim, idx) => {
      console.log(`  #${idx}: "${anim.name || 'unnamed'}" (channels: ${anim.channels?.length || 0})`);
    });
  } else {
    console.log('\n🎬 Animations: None');
  }

  console.log(`\n🎨 Materials (${materials.length}):`);
  materials.forEach((mat, idx) => {
    console.log(`  #${idx}: "${mat.name || 'unnamed'}"`);
  });

  console.log('\nAnatomy Node Check (skin_*, muscle_*, bone_*, organ_*):');
  const anatomyNodes = nodes.filter(n => n.name && /^(skin|muscle|bone|organ)_/i.test(n.name));
  if (anatomyNodes.length > 0) {
    console.log(`  ✅ Found ${anatomyNodes.length} standardized anatomical nodes:`);
    anatomyNodes.forEach(n => console.log(`     - ${n.name}`));
  } else {
    console.log('  ⚠️ No nodes matching anatomical prefixes (skin_*, muscle_*, bone_*, organ_*).');
    console.log('     Model will operate in rotation/animation-only view mode.');
  }

  console.log('====================================================\n');
}

const targetFile = process.argv[2] || 'public/models/vulpes-vulpes.glb';
inspectGlb(targetFile);
