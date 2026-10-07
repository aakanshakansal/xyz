
import Export from "../components/ui/Sidebar/Elements/Export"
import Screenshot from "../components/ui/Sidebar/Elements/Screenshot"

export const elementActions = {
  screenshot: ({ threeRuntime }) =>
    Screenshot({
      canvas: threeRuntime?.gl?.domElement,
      renderer: threeRuntime?.gl,
      scene: threeRuntime?.scene,
      camera: threeRuntime?.camera,
    }),
  "export-scene": ({ threeRuntime }) => {
    Export({
      scene: threeRuntime?.scene,
    });
  },
  "3D-text": ({ onOpen3DText }) => {
    onOpen3DText?.();
  },
  "external-links": ({ onOpenExternalLInk }) => {
    onOpenExternalLInk?.();
  },
  "overlay": ({ onOpenOverlay }) =>{
    onOpenOverlay?.();
  },
};

export  function runElementActions(id, context={})
{
    const action = elementActions[id]
    if(!action)
    {
        console.log("Add element",id)
        return false;
    }
    action(context)
    return true;
}