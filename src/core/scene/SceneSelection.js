import * as THREE from "three"

export function createSceneSelection (scene){
    let selectedObject = null;

    const box = new THREE.Box3();
    const helper = new THREE.Box3Helper(
        box,
        0x00aaff
    )

    helper.name = "Selection_Helper"
    helper.userData.isEditorHelper = true;
    helper.userData.BadvisorIgnorePicking = true;

    helper.visible= false ;

    scene.add(helper)

    function select(object){
        if(!object)
        {
            clear();
            return;
        }

        selectedObject = object;
        update()
        helper.visible= true ;
    }

    function getSelected(){
        return selectedObject;
    }

    function clear(){
        selectedObject= null;
        helper.visible= false;
    }

    function update(){
        if(!selectedObject){
            helper.visible= false;
            return;
        }
        box.setFromObject(selectedObject);
        if(box.isEmpty())
        {
            helper.visible= false;
            return;
        }
        helper.visible= true;
    }

    function dispose(){
        clear();
        if(helper.parent)
        {
            helper.parent.remove(helper)
        }

        helper.geometry?.dispose?.();
        helper.material?.dispose?.();
    }

    return {
        select,
        clear,
        update,
        dispose,
        getSelected,
        helper,
    }

}