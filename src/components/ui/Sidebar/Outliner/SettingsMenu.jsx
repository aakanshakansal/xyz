import { useState } from "react";
import Effects from "./Settings/Effects"
import EngineSettings from "./Settings/EngineSettings"
import SceneSettings from "./Settings/SceneSettings"
import { FaChevronRight } from "react-icons/fa";
import { IoMdSettings} from "react-icons/io";


const SETTINGS_CHILDREN = [
  { id: "engine-settings", label: "Engine Settings" },
  { id: "scene-settings", label: "Scene Settings" },
  { id: "effects", label: "Effects" },
];

export default function SettingsMenu({ threeRuntime }) {
  const [expanded, setExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const handleSettingsClciked = ()=>{

    setExpanded((value)=> !value)
  }
  const handleChildClick = (id) => {
    setActiveCard(id);
  };
  const closeCard = () => {
    setActiveCard(null);
  };
  return (
    <>
      <div
        onClick={handleSettingsClciked}
        className="flex flex-row  w-full items-center gap-3 rounded-md px-1 py-2 text-left transition"
      >
        <IoMdSettings size={18} className="shrink-0 text-white" />
        <span>Settings </span>

        <span className="ml-auto text-gray-400">
          <FaChevronRight size={18} className="text-gray-400" />
        </span>
      </div>
      <div>
        {expanded && (
          <div>
            {SETTINGS_CHILDREN.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleChildClick(item.id)}
                className="flex w-full h-10 items-center text-left text-gray-300 transition hover:text-lime-500"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {activeCard === "engine-settings" && (
        <EngineSettings onClose={closeCard} threeRuntime={threeRuntime} />
      )}
      {activeCard === "scene-settings" && (
        <SceneSettings onClose={closeCard} threeRuntime={threeRuntime} />
      )}
      {activeCard === "effects" && (
        <Effects onClose={closeCard} threeRuntime={threeRuntime} />
      )}
    </>
  );
}
