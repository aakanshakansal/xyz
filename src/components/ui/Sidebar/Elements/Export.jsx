
import { GLTFExporter } from "three/examples/jsm/Addons.js";


export default function  Export ({scene})  {
  
        if(!scene){
            console.error("Export scene is not availble")
            return;
        }
        const exporter = new GLTFExporter();
        exporter.parse(
            scene,
            (result)=>
            {
                const blob = new Blob([result],{
                    type: "model/gltf-binary"
                })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href= url
                link.download= `badvisor-scene-${Date.now()}.glb`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)

            },(error) =>{
                console.error("GLB export failed",error)
            },
            {
                binary: true,
            }
        )
    
 
}
