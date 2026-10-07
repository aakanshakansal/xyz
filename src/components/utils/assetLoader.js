import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

export function getExtension(name = "")
{
    return name.split(".").pop()?.toLowerCase() || ""

}

export function getFileStem(name = ""){
    return name.replace(/\.[^/.]+$/, "") || "3D Asset";
}

function createFileUrlMap(files){
    const entries = new Map();

    files.forEach((file)=>{
        const url = URL.createObjectURL(file);
        const keys =  [
            file.name,
            file.webkitRelativePath,
            file.name.split("/").pop()
        ].filter(Boolean)

        keys.forEach((key)=>{
            entries.set(key.toLowerCase(), url)
        })
    })
    return entries;
}
function createLoadingManager(fileUrlMap){
    const manager = new THREE.LoadingManager();
    manager.setURLModifier((requestedUrl) =>{
        const clean = decodeURIComponent(
            requestedUrl.split("?")[0],)
            .replace(/\\/g, "/")

            const candidates = [
                clean, clean.split("/").pop(),

            ]
            .filter(Boolean)
            .map((value)=> value.toLowerCase())

            for (const candidate of candidates){
                const mapped = fileUrlMap.get(candidate);
                if(mapped) 
                    return mapped;
            }
            return requestedUrl;
        })
        return manager;
    }

export async function load3DAsset(files){
    const selectedFiles = Array.from(files ?? [])
    const primary = selectedFiles.find((file) => ["glb", "gltf", "vrm", "obj", "stl", "fbx", "splat"].includes(getExtension(file.name))) ?? selectedFiles[0]
    if(!primary){
        throw new Error("No 3D Asset selected ")
    }
    const extension = getExtension(primary.name)
    const fileUrlMap = createFileUrlMap(selectedFiles)
    const manager = createLoadingManager(fileUrlMap)

    try{
        if(["glb", "gltf", "vrm"].includes(extension)){
            const loader = new GLTFLoader(manager)
            if (extension === "vrm") {
                loader.register((parser) => new VRMLoaderPlugin(parser))
            }
            const mainUrl = fileUrlMap.get(primary.name.toLowerCase())
            const gltf = await loader.loadAsync(mainUrl)
            return gltf.scene;

        }
        if(extension === "obj")
        {
            const loader = new OBJLoader(manager)
            const mtlFile = selectedFiles.find(
                (file) => getExtension(file.name) === "mtl",
            )

            if(mtlFile)
            {
                const mtlLoader = new MTLLoader(manager)
                const materials = mtlLoader.parse(
                    await mtlFile.text(),"",
                );
                materials.preload()
                loader.setMaterials(materials)
            }
            return loader.parse(await primary.text())
        }

        if(extension === "stl"){
            const loader = new STLLoader(manager)
            const geometry = loader.parse(await primary.arrayBuffer())
            geometry.computeVertexNormals()

            const material = new THREE.MeshStandardMaterial({
                color: 0xb8b8b8,
                metalness: 0.15,
                roughness: 0.65,
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.name = getFileStem(primary.name)
            return mesh;
        }
        if(extension === "fbx")
        {
            const loader = new FBXLoader(manager)
            return loader.parse(await primary.arrayBuffer(), "")
        }
        throw new Error(`Unsupported format: .${extension}`)
    } finally{
        fileUrlMap.forEach((url)=> URL.revokeObjectURL(url))
    }

}
