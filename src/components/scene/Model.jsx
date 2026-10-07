import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export default function Model({onLoaded}) {
  const { scene } = useGLTF('/models/car.glb')
  useEffect(() => {
    if (!scene) return;

    if (!scene.name || scene.name === "Scene") {
      scene.name = "car.glb";
    }

    onLoaded?.(scene);
  }, [scene, onLoaded]);


  return (
   
    <primitive
      object={scene}
      scale={0.005} 
      position={[0, -1, 0]}
    />
   
  )
}

useGLTF.preload('/models/car.glb')