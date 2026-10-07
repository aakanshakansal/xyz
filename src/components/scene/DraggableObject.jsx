import { useRef } from "react";
import * as THREE from "three"

export default function DraggableObject({children, 
    objectRef,
    enabled= true,
    onDragStart,
    onDrag,
    onDragEnd,
}){

    const dragging  = useRef(false)
    const dragPlane = useRef(new THREE.Plane())
    const  offset = useRef(new THREE.Vector3())
    const intersection = useRef(new THREE.Vector3())

    const handlePointerDown = (event) =>{
        if(!enabled) return ;
        event.stopPropagation();

        const object = objectRef?.current;
        if(!object) return ;
        // const camera = event.camera ;
        const planeY = object.getWorldPosition(new THREE.Vector3(),).y

        dragPlane.current.set(new THREE.Vector3(0,1,0),
        -planeY,
    )
    if(!event.ray.intersectPlane(
        dragPlane.current,
        intersection.current
    )){
        return;
    }

    offset.current.copy(object.position)
    .sub(intersection.current)
    dragging.current = true;

    event.target?.setPointerCapture?.(event.pointerId);
    onDragStart?.(object);

    }
    const handlePointerMove = (event) =>{
        if(!dragging.current) return;
        event.stopPropagation()
        const object = objectRef.current;
        if(!object) return;
        if(!event.ray.intersectPlane(
            dragPlane.current,
            intersection.current
        )        )
        {
            return;
        }
        const nextPosition = intersection.current.clone()
        .add(offset.current)

        nextPosition.y = object.position.y
        object.position.copy(nextPosition)
        object.updateMatrixWorld(true)

        onDrag?.(object);
    }
    const handlePointerUp =(event)=>{
        if(!dragging.current) return;
        event.stopPropagation();
        dragging.current = false
        event.target?.releasePointerCapture?.(
            event.pointerId,
        )
        onDragEnd?.(objectRef?.current)
    }
    return (
        <group
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        >{children}</group>
    )
}