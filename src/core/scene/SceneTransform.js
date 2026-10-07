
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

import { TransformControls } from "three/addons/controls/TransformControls.js";
export function createSceneTransform({
    scene, camera , renderer, runtimeRef, selection , onChanged,
}){


    const controls = new TransformControls(camera, renderer.domElement);

    controls.setMode("translate")
    controls.setSpace("world")
    controls.setSize(1)

    const helper = controls.getHelper()
    helper.name = "Transform_Control";

    helper.userData.isEditorHelper = true;
    helper.userData.BadvisorIgnorePicking = true;

    helper.visible= false;

    scene.add(helper);

    function attach(object){
        if(!object){
            detach();
            return
            
        }
        controls.attach(object);
        helper.visible = true ;

    }

    function detach()
    {
        controls.detach();
        helper.visible= false;
    }

    function setMode(mode){
        if(
            mode !== "translate" && 
            mode !== "rotate" && 
            mode !== "scale"
        ){
            return;
        }

        controls.setMode(mode);
    }
    function getMode(){
        return controls.mode;
    }

    function handleChange(){
        const object = selection.getSelected();

        if(!object) return;
        selection.update();
        onChanged?.(object);
    }

    function handleDraggingChanged(event){
        const orbitControls = runtimeRef.current?.orbitControls;

        if(orbitControls)
        {
            orbitControls.enabled = !event.value;

        }
    }

    controls.addEventListener("change", handleChange);
    controls.addEventListener("objectChange", handleChange);
    controls.addEventListener("dragging-changed",
        handleDraggingChanged
    )

    function dispose(){
        controls.removeEventListener("change", handleChange);

        controls.removeEventListener("objectChange", handleChange);

        controls.removeEventListener("dragging-changed", handleDraggingChanged);

        controls.detach();

        if(helper.parent){
            helper.parent.remove(helper);

        }

        controls.dispose();


    }



    
    return{
        controls,
        helper,
        attach,
        detach,
        setMode,
        getMode,
        dispose,
    };
}