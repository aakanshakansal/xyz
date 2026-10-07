import * as THREE from "three"

export function createSceneInteraction({
    scene,
    renderer,
    camera,
    selection,
    transform,
    onSelectionChanged,
    onSceneChanged,
}){

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const canvas = renderer.domElement;
    function isSelectable(object){
        if(!object)  return false;

        if(object.userData?.isEditorHelper){
            return false;
        }

        if (object.userData?.badvisorIgnorePicking) {
          return false;
        }

        return (
            object.isMesh || 
            object.isGroup
        );
    }

    function findSelectableObject (object){
        let current = object ;
        while(current){
            if(isSelectable(current))
            {
                return current;
            }
            current = current.parent;
        }

        return null;
    }

    function getInterSections(event) {
        const rect = canvas.getBoundingClientRect();

        pointer.x = ((event.clientX - rect.left)/ rect.width) * 2 -1;
         pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

         raycaster.setFromCamera(pointer,camera)

         const  intersections = raycaster.intersectObjects(scene.children,true)

         return intersections;

    }


    function handlePointerDown (event){
        if(event.button !== 0)
        {
            return;
        }
        const intersections = getInterSections(event)
        let selectedObject = null;

        for(const hit of intersections)
        {
            const object = findSelectableObject(hit.object)

            if(object){
                selectedObject = object;
                break;
            }
        }

        if(!selectedObject){
            selection.clear();
            transform.detach();
            onSelectionChanged?.(null);
            onSceneChanged?.();
            return;



        }

        selection.select(selectedObject);
        transform.attach(selectedObject)
        onSelectionChanged?.(selectedObject)
        onSceneChanged?.(selectedObject)

    }

    canvas.addEventListener("pointerdown", handlePointerDown)

    function dispose(){
        canvas.removeEventListener("pointerdown", handlePointerDown);
    }






    return {
        dispose,
    }
}