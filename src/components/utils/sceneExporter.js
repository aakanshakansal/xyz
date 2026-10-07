import { GLTFExporter} from "three/addons/exporters/GLTFExporter.js";
import {  USDZExporter  } from "three/addons/exporters/USDZExporter.js";
const EXPORT_OPTIONS = {
    maxTextureSize: 4096,
    onlyVisible: false,
}

function downloadBlob(data, filename , type){
    const blob = data instanceof Blob
    ? data
    : new Blob([data], {type})

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href= url
    link.download= filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(()=>{
        URL.revokeObjectURL(url)
    },1000)
}

function createFilename(extension){
    return `badvisor-scene-${Date.now()}.${extension}`
}

export async function exportScene({scene, format = "glb"}){
    if(!scene){
        throw new Error("Export scene not available")
    }
    if(format === "glb"){
        const exporter = new GLTFExporter()

        const result = await exporter.parseAsync(scene, {
            ...EXPORT_OPTIONS,
            binary: true,

        })
        downloadBlob(result,createFilename("glb"), "model/gltf-binary")
        return;
    }
    if (format === "usdz") {
      const exporter = new USDZExporter();

      const result = await exporter.parseAsync(scene, {
       includeAnchoringProperties:true,
       quickLookCompatible:true,
      });
      downloadBlob(result, createFilename("usdz"), "model/vnd.usdz+zip");
      return;
    }
     
    throw new Error(`Unsupported export format: ${format}`)
}