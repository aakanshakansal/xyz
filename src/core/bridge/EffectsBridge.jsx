import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, } from "react";

import { createEffectsRuntime } from "../runtime/EffectsRuntime";


export function EffectsBridge({runtimeRef}){
  const { scene, gl, camera, size  } = useThree();

  const effectsRef = useRef(null)
  useEffect(()=>{
    let cancelled = false ;
    if(!scene || !gl || !camera ){
      return undefined;

    }

    (async()=>{
      try{
        const effects = await createEffectsRuntime({
          scene,
          renderer: gl,
          camera,
          width: size.width,
          height: size.height,
        })
        if(cancelled){
          effects.dispose?.();
          return;
        }

        effectsRef.current = effects;
        runtimeRef.current = runtimeRef.current ||
        {scene, gl, renderer:gl, camera}
        runtimeRef.current.effects = effects;
        effects.update?.(
          runtimeRef.current.effectSettings  || {},
          runtimeRef.current.sceneSettings  || {},

        );

      }
      catch(error){
        console.error("Effects Runtime Failed ",error)
      }
    })();
    return () =>{
      cancelled= true;
      effectsRef.current?.dispose?.();
      effectsRef.current= null;
      if(runtimeRef.current){
        delete runtimeRef.current.effects;
      }
    }
  },[scene,gl,camera])

  useEffect(()=>{
    effectsRef.current?.resize?.(size.width,size.height);
  },[size.width, size.height])

  useFrame(() =>{
    effectsRef.current?.render?.()
  },1)

  return null;

}