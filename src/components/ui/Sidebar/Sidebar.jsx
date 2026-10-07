import {useState} from 'react'
import { FaPlus } from 'react-icons/fa6';
import {
  IoIosRocket,
} from "react-icons/io";
import { MdAccountTree } from "react-icons/md";
import SidebarHeader from './SidebarHeader'
import SidebarFooter from './SidebarFooter'
import ElementsPanel from './Elements/ElementsPanel'
import EssentialsPanel from './Essentials/EssentialsPanel'
import OutlinerPanel from './Outliner/OutlinerPanel'

const tabs = [
  {id: 'elements', label: 'Elements', icon: FaPlus},
  {id: 'essentials', label: 'Essentials', icon: IoIosRocket},
  {id: 'outliner', label: 'Outliner', icon: MdAccountTree},
]





export default function Sidebar({ onClose, stats, threeRuntime, sceneVersion, onSceneChanged, onAdd3DText, onAddSplat }) {
  const [activeTab, setActiveTab] = useState("essentials");

  return (
    <div className="viewer-sidebar-surface flex h-full w-full flex-col  text-white">
      <SidebarHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex shrink-0 items-center  border-b border-gray-700 p-3 text-sm font-bold text-white">
        My First Scene
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2">
        {activeTab === "elements" && (
          <ElementsPanel
            threeRuntime={threeRuntime}
            onSceneChanged={onSceneChanged}
            onAdd3DText={onAdd3DText}
          />
        )}
        {activeTab === "essentials" && (
          <EssentialsPanel
            threeRuntime={threeRuntime}
            sceneVersion={sceneVersion}
            onSceneChanged={onSceneChanged}
            onAddSplat={onAddSplat}
            onAdd3DText={onAdd3DText}
          />
        )}
        {activeTab === "outliner" && (
          <OutlinerPanel stats={stats} threeRuntime={threeRuntime} />
        )}
      </div>

      <SidebarFooter onClose={onClose} threeRuntime={threeRuntime} />
    </div>
  );
}



