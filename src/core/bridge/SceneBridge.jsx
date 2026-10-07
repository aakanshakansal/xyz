
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";


export function SceneBridge({ onSceneReady , runtimeRef})  {
  const { scene, gl, camera } = useThree();
  useEffect(() => {
    if (!onSceneReady) return;
    
    const runtime = { 
      scene,
      gl,
      camera,
      renderer: gl,
      sceneSettings: null,
      effectSettings: {},
      selectedObject: null,
      selection: null,
      transform: null,
      interaction: null,

     };
    runtimeRef.current = runtime;
    onSceneReady(runtime);

}, [onSceneReady, scene, gl, camera, runtimeRef]);
return null;
}