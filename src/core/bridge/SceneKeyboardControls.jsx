import { useEffect } from "react";

export function SceneKeyboardControls({runtimeRef}){
  useEffect(()=>{
    function handleKeyDown(event){
      const runtime= runtimeRef.current

      if(!runtime?.transform){
        return;
      }

      const selectedObject = runtime.selection?.getSelected?.();
      if(!selectedObject){
        return;
      }

      const target = event.target;

      if(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement || 
        target?.isContentEditable
      ) 
      {
        return;
      } 
      switch (event.key.toLowerCase()){
        case "w":
          runtime.transform.setMode("translate");
          break;

        case "a":
          runtime.transform.setMode("rotate");
          break;
        case "s":
          runtime.transform.setMode("scale");
          break;
        case "escape":
          runtime.selection.clear();
          runtime.transform.detach();
          runtime.seletedObject = null;
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return ()=>{
      window.removeEventListener("keydown", handleKeyDown);
    };
  },[runtimeRef])

  return null;

}