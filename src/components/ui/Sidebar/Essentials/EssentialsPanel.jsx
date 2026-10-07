import { RiLightbulbFlashLine } from "react-icons/ri";
import { GiCube } from "react-icons/gi";
import {
  TbTexture,
} from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import ThreeDView from "./3D/ThreeDView";
import { useState } from "react";
import  ScenePanel  from "./EssentialScene/ScenePanel";
import LightingPanel from "./Lighting/LightingPanel";

const tabs = [
  {
    id: "scene",
    label: "Scene",
    icon: IoMdSettings,
  },
  {
    id: "3D",
    label: "3D",
    icon: GiCube,
  },
  {
    id: "lighting",
    label: "Lighting",
    icon: RiLightbulbFlashLine,
  },
  {
    id: "fx",
    label: "FX",
    icon: TbTexture,
  },
];
export default function EssentialsPanel({threeRuntime, sceneVersion, onSceneChanged, onAddSplat, onAdd3DText}){
  const [activeTab, setActiveTab ] = useState("3D")
  return (
    <section className="viewer-sidebar-surface flex h-full min-h-0 min-w-0 flex-col  text-white">
      <div className="grid shrink-0 grid-cols-4 border-b border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-0 items-center justify-center gap-1 px-1 py-2 text-sm font-semibold transition-colors duration-150 ${
                active
                  ? "bg-[#34c5b7] text-black"
                  : "bg-black text-[#bada55] hover:bg-[#222]"
              }`}
            >
              <Icon size={15} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden ">
        {activeTab === "scene" && <ScenePanel />}

        {activeTab === "3D" && (
          <ThreeDView
            threeRuntime={threeRuntime}
            sceneVersion={sceneVersion}
            onSceneChanged={onSceneChanged}
            onAddSplat={onAddSplat}
            onAdd3DText={onAdd3DText}
          />
        )}

        {activeTab === "lighting" && <LightingPanel />}
      </div>
    </section>
  );
}