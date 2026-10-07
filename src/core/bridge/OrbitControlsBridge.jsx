
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";

export function OrbitControlsBridge({ runtimeRef}){

  const { gl } = useThree();
  const controlsRef = useRef(null);

  useEffect (()=>{
    const controls = controlsRef.current;

    if(!controls){
      return;
    }

    if(runtimeRef.current)
    {
      runtimeRef.current.orbitControls = controls;
    }

    return ()=>{
      if(runtimeRef.current?.orbitControls === controls)
      {
        delete runtimeRef.current.orbitControls;
      }
    }
  },[gl, runtimeRef]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={2}
      maxDistance={30}
    />
  );
}