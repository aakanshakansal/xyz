import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { elementGroups } from "../../../../data/elements.js";
import { runElementActions } from "../../../../actions/elementActions.js";
import ElementCard from "./ElementCard.jsx";
import ThreeDTextModal from "./ThreeDTextModal.jsx";
import ExternalLinkModal from "./ExternalLinkModal"
import Overlay from "./Overlay";


export default function ElementsPanel({ threeRuntime , onAdd3DText, }) {
  const [search, setSearch] = useState("");
  const [show3dTextModal, setShow3DTextModal] = useState(false)
  const [showExternalLinkModal,setShowExternalLinkModal]  = useState(false)
  const [showOverlay, setShowOverlay] = useState(false);

  const filteredGroups= useMemo(()=>{
    const query = search.trim().toLowerCase();
    if(!query) return elementGroups;

    return elementGroups.map((group)=>({
      ...group,
      items: group.items.filter((item)=>
      item.title.toLowerCase().includes(query),)

    }))
    .filter((group)=> group.items.length > 0 )
  },[search])

  const handleElementActions = (item) => {
  runElementActions(item.id , {
    threeRuntime, 
    onOpen3DText : () =>{
      setShow3DTextModal(true);
    },
    onOpenExternalLInk : () =>{
      setShowExternalLinkModal(true);
    },
    onOpenOverlay :() =>{
      setShowOverlay(true);
    },
  })
  };

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col text-white">
      <div className="shrink-0  p-3">
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
        <p className="mt-6 text-center ">
          Drag or double click to add elements in the viewport
        </p>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-9 pt-2">
        {filteredGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <h2 className="mb-3 text-base font-medium text-white">
              {" "}
              {group.title}
            </h2>
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 px-2">
              {group.items.map((item) => (
                <ElementCard
                  key={`${group.title}-${item.id}`}
                  title={item.title}
                  icon={item.icon}
                  color={item.color}
                  onDoubleClick={() => handleElementActions(item)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("application/x-badvisor-element", item.id);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        {
          !filteredGroups.length && (
            <p className="px-2 py-8 text-center text-[1.2vw] text-gray-300">
              No Elements found 
            </p>
          )
        }

      </div>
      {
        show3dTextModal && (
          <ThreeDTextModal
          onClose= {()=> setShow3DTextModal(false)}
          onConfirm= {(config)=>{
            onAdd3DText?.(config);
            setShow3DTextModal(false);
          }}
          />
        )
      }
      {
        showExternalLinkModal && (
          <ExternalLinkModal
          onClose= {() => setShowExternalLinkModal(false)}
          onConfirm={(config) => {
    console.log("External Link Config:", config);

    setShowExternalLinkModal(false);
          }
        }
          />
        )
      }
      {
        showOverlay && (
          <Overlay
          onClose={() => setShowOverlay(false)}
          // onConfirm= {(config)=>{
          //   console.log("Overlay Panel Config:",config);
          //   setShowOverlay(false);
          // }}
          />
        )
      }
    </section>
  );
}