import { useCallback, useState } from "react";
import Scene from "./components/scene/Scene";
import Sidebar from "./components/ui/Sidebar/Sidebar";

function App() {
  const [stats, setStats] = useState({
    fps: 0,
    drawCalls: 0,
    triangles: 0,
  });
  const [runtimeSplats, setRuntimeSplats] = useState([])
  const [runtimeTexts, setRuntimeTexts] = useState([]);
  const [threeRuntime, setThreeRuntime] = useState(null)
  const [sceneVersion , setSceneVersion]= useState(0)
  const handleSceneChanged = useCallback(()=>{
    setSceneVersion((version)=>version+ 1)
  }, [])
  const handleSceneReady= useCallback((runtime)=>{
    setThreeRuntime(runtime);
  },[])


  const  handleAddSpalt = useCallback((file,url) =>{
    const splatUrl = url || URL.createObjectURL(file);

    setRuntimeSplats((previous) =>[
      ...previous, 
      {
        id: `${file.name} - ${crypto.randomUUID()}`,
        name: file.name.replace(/\.[^/.]+$/,"") || "Splat",
        url: splatUrl,
      },
    ])
  },[])

  const handleAdd3DText = useCallback((config)=>{
    const textId = crypto.randomUUID()

    setRuntimeTexts((previous)=>[
      ...previous,
      {
        id: textId,
        name: `3DText_${Date.now()}`,
        text: config.text,
        font: config.font,
        resolution: config.resolution,
        fontsize: 2,
        depth: 0.4,
        color: "#ffffff",
        position:[0,0.5,0],
        rotation:[0,0,0],
        scale: [1,1,1],
        visible:true,

      }
    ])
    setSceneVersion((version)=> version +1)
  },[])
  return (
    <main className="relative h-screen w-full min-h-0 min-w-0 overflow-hidden">

   
      <div className="viewer-canvas absolute inset-0">
        <Scene  onStatsUpdate={setStats}
        onSceneReady={handleSceneReady}
        onSceneChanged={handleSceneChanged}
        runTimeText={runtimeTexts}
        runtimeSplats={runtimeSplats}
        />
      </div>

      <div className=" viewer-sidebar pointer-events-auto absolute right-0 top-0 z-20 h-full overflow-y-auto overflow-x-hidden">
        <Sidebar stats= {stats}  threeRuntime={threeRuntime}
        sceneVersion={sceneVersion}
        onSceneChanged={handleSceneChanged}
        onAdd3DText={handleAdd3DText}
        onAddSplat={handleAddSpalt}

        />
      </div>

    
      <div className="pointer-events-none absolute left-[1.5vw]  top-[1.5vh] z-10">
        <h1 className="text-[clamp(1rem,2vw,2.5rem)] font-bold text-white">
          Badvisor 3D Viewer
        </h1>
        
      </div>

    </main>
  );
}

export default App;