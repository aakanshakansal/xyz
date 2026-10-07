
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import DraggableObject from "../../../scene/DraggableObject";


const Default_Text = "Badvisor"
const Font_URL = "/fonts/helvetiker_regular.typeface.json";
const Default_Options = {
    size : 1.5,
    depth: 5, 
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness : 0.04,
    bevelSize : 0.03,
    bevelSegments: 3,
    color: "#ffffff"
};

export default function ThreeDText({
     id, 
     name = "3D Text", 
     text = Default_Text ,
     font = "FigTree Medium",
     fontSize = Default_Options.size,
     depth = Default_Options.depth,
     resolution = Default_Options.curveSegments,
     color = Default_Options.color,
     position = [0,1,0],
     rotation =[0,0,0],
     scale= [1,1,1],
     visible= true,


}) {
  const groupRef = useRef();
  const threeFont = useLoader(FontLoader, Font_URL);
  const geometry = useMemo(() => {
    const value = text?.trim() || Default_Text;

    const textGeometry = new TextGeometry(value, {
      font: threeFont,
      size: fontSize,
      depth,
      curveSegments : Math.max(4,Math.min(32, Number(resolution) || Default_Options.curveSegments,),),
      bevelEnabled: Default_Options.bevelEnabled,
      bevelThickness: Default_Options.bevelThickness,
      bevelSize: Default_Options.bevelSize,
      bevelSegments: Default_Options.bevelSegments,
    });

    textGeometry.computeBoundingBox();

    if(textGeometry.boundingBox){
        const center = new THREE.Vector3()
        textGeometry.boundingBox.getCenter(center)

        textGeometry.translate(
            -center.x,
            -center.y,
            -center.z,
        )
    }
    textGeometry.computeVertexNormals();
    return textGeometry;
  },[
    threeFont,
    text,
    fontSize,
    depth,
    resolution,
  ]);


  useEffect(()=>{
    const group = groupRef.current;
    if(!group)
    {
        return ;
    }
    group.name = name;
    group.userData = {
        ...group.userData,
        badvisorType: "3DText",
        id,
        displayName: name,
        text, 
        font,
        resolution,
        fontSize,
        depth,
        color,

    }
  },[
    id, name, text, font , resolution, fontSize, depth, color

  ])
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <DraggableObject
    objectRef={groupRef}
    enabled={true}
    onDrag={(object)=>{
        object.userData = {
          ...object.userData,
          position: [object.position.x, object.position.y, object.position.z],
        };
    }}
    onDragEnd={(object)=>{
        object?.updateMatrixWorld(true)
    }}
    >
      <group
        ref={groupRef}
        name={name}
        position={position}
        rotation={rotation}
        scale={scale}
        visible={visible}
      >
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.4}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>
    </DraggableObject>
  );
}