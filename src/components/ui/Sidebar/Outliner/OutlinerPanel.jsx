import  { useEffect, useMemo, useState } from "react";
import {OutlinerItems} from "../../../../data/outliner.js"
import OutlinerRow from "./OutlinerRow.jsx";
import CapturePanel from "./CapturePanel.jsx";
import Help from "./Help.jsx"
import SettingsMenu from "./SettingsMenu.jsx";
import { get3DElementRoots, get3Dchildren, SceneTreeNode, objectMatchesSearch } from "./3DElement.jsx";
import { 
  FaSearch,
  FaChevronDown,
  FaChevronRight,
 } from "react-icons/fa";



export default function OutlinerPanel({ stats, threeRuntime }) {
  const [search, setSearch] = useState("");
  const [showCapture, setShowCapture] = useState(false);
  const [showHelp, setShowHelp] = useState(false ) 
   const [settingsExpanded, setSettingsExpanded] = useState(false); 

   const [threeDElementsExpanded, setThreeDElementsExpanded] = useState(false);

   const [expandedNodes , setExpandedNodes] = useState(new Set());

   const [sceneObjects, setSceneObjects] = useState([]);

   const [ selectedObject, setSelectedObject] = useState(null);


   useEffect(()=>{

    const scene = threeRuntime?.scene;

    if(!scene){
      setSceneObjects([]);
      return undefined;
    }

    const updateSceneObjects = () =>{
      setSceneObjects(get3DElementRoots(scene));
    }

    updateSceneObjects();

    const interval = setInterval(updateSceneObjects,500);

    return ()=>{
      clearInterval(interval);
    };
   },[threeRuntime]);

   useEffect(() =>{
    if(!threeRuntime){
      return undefined;

    }
    const updateSelection = () =>{

      const object = threeRuntime.selection?.getSelected?.() || threeRuntime.selectedObject || null ;

      setSelectedObject(object);
    };

    updateSelection();

    const interval = setInterval(updateSelection,100);

    return () =>{
      clearInterval(interval);
    }
   }, [threeRuntime]);

   const toggleExpanded = (uuid) =>{
    setExpandedNodes((previous) =>{

      const next = new Set(previous);

      if(next.has(uuid)){
        next.delete(uuid);
      }
      else{
        next.add(uuid);
      }

      return next;
    })
   }

   const handleObjectSelect = (object) =>{
      if(!object){
        return;
      }

      threeRuntime?.selection?.select(object);

      threeRuntime?.transform?.attach(object);

      if(threeRuntime){
        threeRuntime.selectedObject = object;

      }

      setSelectedObject(object);
   }


   const handleToggleVisibility = (object) =>{

    if(!object){
      return;
    }

    object.visible = !object.visible;

    setSceneObjects((previous)=>[
      ...previous,
    ]);
   }

   const normalizedSearch = search.trim().toLowerCase();

   const filteredItems = useMemo (()=>{
    if(!normalizedSearch){
      return OutlinerItems;
    }

    return OutlinerItems.filter((item)=>{
      if(item.id === "3d-elements"){
        return sceneObjects.some((object)=>
        objectMatchesSearch(object, normalizedSearch));
      }

      return item.label
      .toLowerCase()
      .includes(normalizedSearch);
    })
   },[normalizedSearch, sceneObjects])

   const filteredSceneObjects = useMemo(()=>{

    if(!normalizedSearch){
      return sceneObjects;
    }

    return sceneObjects.filter((object)=>{
      return objectMatchesSearch(object, normalizedSearch)
    });
   },[normalizedSearch, sceneObjects])


   useEffect(()=>{

    if(!normalizedSearch){
      return;

    }

    setThreeDElementsExpanded(true);

    const parentToExpand = new Set();

    const findMatchingChildren = (object) =>{

    const children = get3Dchildren(object);

      children.forEach((child) =>{
        if(objectMatchesSearch(child, normalizedSearch)){
          parentToExpand.add(object.uuid)
        }

        findMatchingChildren(child);
      })
    }
    sceneObjects.forEach(findMatchingChildren);

    setExpandedNodes((previous)=>{

      const next = new Set(previous);

      parentToExpand.forEach((uuid)=>{
        next.add(uuid);
      });
      return next;
    })
   },[normalizedSearch, sceneObjects]);


  const handleOutlinerClick = (item) => {
    if (item.id === "capture") {
      setShowCapture(true);
      return;
    }
    if (item.id === "help") {
      setShowHelp(true);
      return;
    }
    
    console.log(`clciked on ${item.id}`);
  };

  return (
    <div className="flex h-full w-full flex-col text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-700 p-4 text-sm font-bold text-white">
        <p>{ threeRuntime?.gl?.isWebGPURenderer ? "WebGPU" : "WebGL2" }</p>
        <p>
          FPS: {""}
          <span>{stats?.fps ?? 0}</span>
        </p>
        <p>
          Draw Calls: {""}
          <span>{stats?.drawCalls ?? 0}</span>
        </p>
      </div>
      <div className="shrink-0 p-3">
        <div className="relative">
          <FaSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-black py-1 pl-8 pr-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto ">
        {filteredItems.map((item) => {

          if(item.id === "3d-elements"){
            return (
              <div key={item.id} className="w-full">
                <button
                  type="button"
                  onClick={() => setThreeDElementsExpanded((value) => !value)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2  text-left text-gray-300 transition-colors hover:bg-gray-800"
                >
                  {item.icon && (
                    <item.icon size={18} className="shrink-0 text-white" />
                  )}

                  <span className="flex-1 text-sm">{item.label}</span>

                  <span className="text-xs text-gray-400">
                    {sceneObjects.length}
                  </span>

                  {threeDElementsExpanded ? (
                    <FaChevronDown size={11} className="text-gray-400" />
                  ) : (
                    <FaChevronRight size={11} className="text-gray-400" />
                  )}
                </button>
                {
                  threeDElementsExpanded && (
                    <div className="pb-1">
                      {
                        filteredSceneObjects.length > 0 ? (
                          filteredSceneObjects.map((object)=>(
                            <SceneTreeNode
                            key={object.uuid}
                            object={object}
                            depth={0}
                            expandedNodes={expandedNodes}
                            selectedObject={selectedObject}
                            onToggle={toggleExpanded}
                            onSelect={handleObjectSelect}
                            onToggleVisibility={handleToggleVisibility}
                            />
                          ))
                        ): (
                          <div className="px-8 py-2 text-xs text-gray-500">
                            No 3D Elements.
                            </div>
                        )
                      }

                    </div>
                  )
                }
              </div>
            );
          }
          if(item.id === "settings"){
            return(
              <SettingsMenu
              key={item.id}
              expanded ={settingsExpanded}
              onToggle={()=>setSettingsExpanded((value)=> !value)}
              threeRuntime= {threeRuntime}
              />
            )}
       return(
          <OutlinerRow
            key={item.id}
            {...item}
            onClick={() => handleOutlinerClick(item)}
          />
        )
})}
      </div>
      {showCapture && (
        <CapturePanel
          canvas={threeRuntime?.gl?.domElement}
          onClose={() => setShowCapture(false)}
        />
      )}
      {showHelp && <Help onClose={() => setShowHelp(false)} />}
      
    </div>
  );
}
