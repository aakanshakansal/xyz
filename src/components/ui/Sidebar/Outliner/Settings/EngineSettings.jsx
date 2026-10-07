import { useState, useEffect } from "react";
import FloatingCard from "../../../common/FloatingCard";
import { FaCog} from "react-icons/fa";
import { applyEngineSettings } from "../../../../../core/runtime/EngineSettingsRuntime";
import { Toggle ,
  SettingsSection,
} from "../../../common/SettingsControls";

const Storage_Key = "Badvisor_Engine_Settings";
const DEFAULTS = {
  resolution: "HD",
  webGPU: false,
  notes: "",
};

function readStoredSettings() {
  try {
    const storedSettings = JSON.parse(localStorage.getItem(Storage_Key) || "null");
    return { ...DEFAULTS, ...(storedSettings || {}) };
  } catch {
    return DEFAULTS;
  }
}

export default function EngineSettings({ onClose, threeRuntime }) {
  const [settings , setSettings ] = useState(readStoredSettings);

  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    if(!threeRuntime) return;
    applyEngineSettings(threeRuntime, settings);
    localStorage.setItem(Storage_Key, JSON.stringify(settings));
  }, [threeRuntime, settings]);

  const update = (key, value) => {
    setSettings((prev) =>( 
      { ...prev, [key]: value }
     
    ))
  }


  const handleWebGPUToggle = () => {
    const next = !settings.webGPU;
    update("webGPU", next);

    window.setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <FloatingCard
      title="Engine Settings"
      icon={<FaCog size={15} />}
      width={350}
      initialPosition={{
        x: 20,
        y: 100,
      }}
      onClose={onClose}
    >
      <div className="space-y-1 py-2">
        <div className="text-sm   text-gray-200">
          Resolution (reload required)
        </div>
        <select
          value={settings.resolution}
          onChange={(event) => update("resolution", event.target.value)}
          className="h-10 w-full rounded bg-[#555555]  text-sm text-white outline-none px-2"
        >
          <option className="bg-[#242323]" value="HD">
            HD{" "}
          </option>
          <option className="bg-[#242323]" value="Medium">
            Medium{" "}
          </option>
          <option className="bg-[#242323]" value="SD">
            SD{" "}
          </option>
        </select>
        <div className="mt-3 px-2  flex items-center justify-between h-10 w-full rounded bg-[#555555]  text-sm text-white outline-none px-2">
          <span>Enable WebGPU (reload required)</span>

          <Toggle
            checked={settings.webGPU}
            onChange={handleWebGPUToggle}
          />
         
        </div>
        <p className="text-xs px-1 text-gray-400">
          {threeRuntime?.gl?.isWebGPURenderer
            ? "WebGPU is an engine-start setting. Changing it reload the viewer so R3F can create the WebGPU renderer instead of the existing WebGL renderer."
            : "WebGL is an engine-start setting. Changing it reload the viewer so R3F can create the WebGL renderer instead of the existing WebGPU renderer."}
        </p>
        <SettingsSection
        name="Notes"
        open={notesOpen}
        onClick={() => setNotesOpen((value) => !value)}
        >
          <textarea
          value={settings.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Enter Notes"
              className="h-40 w-full rounded bg-[#242323] px-2 py-1 text-sm font-semibold text-white resize-none"
              />
        </SettingsSection>
        
      </div>
    </FloatingCard>
  );
}
