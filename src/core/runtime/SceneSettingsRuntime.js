import * as THREE from "three";
// import { Line2 } from "three/addons/lines/Line2.js";
const BOUNDING_BOX_HELPER = new THREE.Box3Helper(new THREE.Box3(), 0xffffff);

// class ThickBox3Helper extends Line2{
//     constructor(box, color, linewidth = 4){ 
        
//         const geometry = new LineGeometry();

//         const positions = ThickBox3Helper.getBoxPositions(box);
//         geometry.setPositions(positions);

//         const material = new LineMaterial({
//             color: color,
//             linewidth: linewidth,
//             dashed: false,
//         });
//         super(geometry, material);

//         this.type = "ThickBox3Helper";

//         this.material.resolution.set(window.innerWidth, window.innerHeight);
//     }
//     static getBoxPositions(box){
//         const min = box.min;
//         const max = box.max;
//         return [
//             min.x, min.y, min.z,
//             max.x, min.y, min.z,
//             max.x, max.y, min.z,
//             min.x, max.y, min.z,
//             min.x, min.y, max.z,
//             max.x, min.y, max.z,
//             max.x, max.y, max.z,
//             min.x, max.y, max.z
//         ];
//     }
//     update(box){
//         this.geometry.setPositions(ThickBox3Helper.getBoxPositions(box));
//         this.geometry.computeBoundingSphere();
//     }
//     dispose(){
//         this.geometry.dispose();
//         this.material.dispose();
//     }
// }

function parseColor(value, fallback = "#dedede") {
  const color = new THREE.Color();

  try {
    color.set(value || fallback);
  } catch {
    color.set(fallback);
  }
  return color;
}

function getMeshes(scene) {
  const meshes = [];
  scene.traverse((object) => {
    if (object.isMesh && !object.userData?.[BOUNDING_BOX_HELPER]) {
      meshes.push(object);
    }
  });
  return meshes;
}

export function applyBackground(runtime, { backgroundColor, transparent }) {
  if (!runtime?.scene || !runtime?.gl) return;

  if (transparent) {
    runtime.scene.background = null;
    runtime.gl.setClearColor(0x000000, 0);
    runtime.gl.setClearAlpha(0);
    return;
  }
  const color = parseColor(backgroundColor, "#dedede");
  runtime.scene.background = color;
  runtime.gl.setClearColor(color, 1);
  runtime.gl.setClearAlpha(1);
}

export function applyEnvironmentIntensity(runtime, value) {
  if (!runtime?.scene) return;

  const intensity = Math.max(0, Number(value) || 0);
  runtime.scene.environmentIntensity = intensity;
}

export function applyFog(runtime, { enabled, color, start, end }) {
  if (!runtime?.scene) return;

  if (!enabled) {
    runtime.scene.fog = null;
    return;
  }

  const fogStart = Math.max(0, Number(start) || 0);
  const fogEnd = Math.max(fogStart + 0.001, Number(end) || 20);
  runtime.scene.fog = new THREE.Fog(
    parseColor(color, "#c42727"),
    fogStart,
    fogEnd,
  );
}

export function applyWireframe(runtime, enabled) {
  if (!runtime?.scene) return;

  const wireframe = Boolean(enabled);
  getMeshes(runtime.scene).forEach((mesh) => {
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      if (!material || !("wireframe" in material)) return;
      material.wireframe = wireframe;
      material.needsUpdate = true;
    });
  });
}
export function removeBoundingBoxHelpers(scene) {
  const helpers = [];

  scene.traverse((object) => {
    if (object.userData?.[BOUNDING_BOX_HELPER]) {
      helpers.push(object);
    }
  });

  helpers.forEach((helper) => {
    helper.parent?.remove(helper);
    helper.geometry?.dispose?.();
    helper.material?.dispose?.();
  });
}

export function applyBoundingBox(runtime, enabled) {
  if (!runtime?.scene) return;

  const { scene } = runtime;
  removeBoundingBoxHelpers(scene);

  if (!enabled) return;

  getMeshes(scene).forEach((mesh) => {
    const box = new THREE.Box3().setFromObject(mesh);

    if (box.isEmpty()) return;
    const helper = new THREE.Box3Helper(box, 0xffffff);
    
    helper.userData[BOUNDING_BOX_HELPER] = true;
    helper.userData.sourceObject = mesh.uuid;
    scene.add(helper);
  });
}

export function applySceneSettings(runtime, settings = {}) {
  if (!runtime?.scene) return;

  const current = {
    ...(runtime.sceneSettings || {}),
    ...settings,
  };

  current.fogEnabled =
    settings.enableFog ??
    settings.fogEnabled ??
    current.fogEnabled ??
    current.enableFog ??
    false;
  current.wireframeEnabled =
    settings.enableWireframe ??
    settings.wireframeEnabled ??
    current.wireframeEnabled ??
    current.enableWireframe ??
    false;
  current.boundingBoxEnabled =
    settings.enableBoundingBox ??
    settings.boundingBoxEnabled ??
    current.boundingBoxEnabled ??
    current.enableBoundingBox ??
    false;

  runtime.sceneSettings = current;
  applyBackground(runtime, {
    backgroundColor: current.backgroundColor,
    transparent: current.transparent,
  });

  applyEnvironmentIntensity(runtime, current.environmentIntensity);
  applyFog(runtime, {
    enabled: current.fogEnabled,
    color: current.fogColor,
    start: current.fogStart,
    end: current.fogEnd,
  });
  applyWireframe(runtime, current.wireframeEnabled);
  applyBoundingBox(runtime, current.boundingBoxEnabled);
}

export function reapplySceneSettings(runtime) {
  if (!runtime?.sceneSettings || !runtime?.scene) return;
  applySceneSettings(runtime, runtime.sceneSettings);
}


