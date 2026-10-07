import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import { createSceneInteraction } from "../scene/SceneInteraction";
import { createSceneSelection } from "../scene/SceneSelection";
import { createSceneTransform } from "../scene/SceneTransform";



export function InteractionBridge({runtimeRef, onSceneChanged}){
  const {scene, camera, gl} = useThree();

  useEffect(()=>{
    if(!scene || !camera || !gl ){
 return undefined;
    }

    const selection = createSceneSelection(scene);

    const transform = createSceneTransform({
      scene,
      camera,
      renderer: gl,
      runtimeRef,
      selection,
      onChanged : (object)=>{
        onSceneChanged?.(object);
      },
    })
    const interaction = createSceneInteraction({
      scene,
      camera,
      renderer:gl,
      selection,
      transform,
      onSelectionChanged: (object ) =>{

        runtimeRef.current.selectedObject = object;
        runtimeRef.current.selection = selection;
        runtimeRef.current.transform = transform;


  if (object) {
    transform.attach(object);
  } else {
    transform.detach();
  }
        
        onSceneChanged?.(object)


      }, onSceneChanged,
    })

     runtimeRef.current.interaction = interaction;
     runtimeRef.current.selection = selection;
     runtimeRef.current.transform = transform;

     return ()=>{
      interaction.dispose();
      transform.dispose();
      selection.dispose();

      if(runtimeRef.current)
        delete runtimeRef.current.selection;
      delete runtimeRef.current.interaction;
      delete runtimeRef.current.transform;
      delete runtimeRef.current.selectedObject;

     }
  },[scene, camera, gl, runtimeRef, onSceneChanged])

  return null;
 
}