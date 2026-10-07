import { useEffect, useState } from "react";

import FloatingCard from "../../../common/FloatingCard";

import { AiFillPicture } from "react-icons/ai";

import { applySceneSettings } from "../../../../../core/runtime/SceneSettingsRuntime";
import {
  Toggle,
  SettingsSection,
  SettingsRow,
  SliderField,
} from "../../../common/SettingsControls";

const Storage_Key = "Badvisor_Scene_Settings";

const DEFAULTS = {
  backgroundColor: "#dedede",
  transparent: false,
  environmentIntensity: 1,
  enableFog: false,
  fogColor: "#c42727",
  fogStart: 0.1,
  fogEnd: 20,
  enableOIT: false,
  enableBoundingBox: false,
  enableWireframe: false,
  notes: "",
};

function readStoredSettings() {
  try {
    const storedSettings = JSON.parse(
      localStorage.getItem(Storage_Key) || "null",
    );
    return { ...DEFAULTS, ...(storedSettings || {}) };
  } catch {
    return DEFAULTS;
  }
}

export default function SceneSettings({ onClose, threeRuntime }) {
  const [settings, setSettings] = useState(readStoredSettings);
  const [fogOpen, setFogOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(Storage_Key, JSON.stringify(settings));
    applySceneSettings(threeRuntime, settings);
  }, [settings, threeRuntime]);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <FloatingCard
      title="Scene Settings"
      icon={<AiFillPicture size={18} />}
      width={350}
      initialPosition={{
        x: 20,
        y: 100,
      }}
      onClose={onClose}
    >
      <div className="max-h-[calc(100vh-180px)] overflow-y-auto space-y-2 py-2 pr-1">
        {/* Background Color */}
        <div className="flex h-10 w-full items-center justify-between rounded bg-[#555555] px-2 text-sm text-white">
          <span>Background Color</span>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(event) =>
                update("backgroundColor", event.target.value)
              }
              className="h-9 w-10 cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(event) =>
                update("backgroundColor", event.target.value)
              }
              className="w-20 bg-transparent text-right outline-none"
            />
          </div>
        </div>

        {/* Transparent */}
        <SettingsRow label="Transparent">
          <Toggle
            checked={settings.transparent}
            onChange={(value) => update("transparent", value)}
          />
        </SettingsRow>

        {/* Environment Intensity */}
        <SliderField
          label="Environment Intensity"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={settings.environmentIntensity}
          onChange={(value) => update("environmentIntensity", value)}
        />
        {/* Environment Texture */}
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded bg-[#555555] px-2 text-sm text-white"
        >
          <span>Environment Texture</span>
          <p>Not Implemented Yet</p>
        </button>

        {/* Fog  */}

        <SettingsSection
          name="Fog"
          open={fogOpen}
          onClick={() => setFogOpen((value) => !value)}
        >
          <SettingsRow label="Enable Fog">
            <Toggle
              checked={settings.enableFog}
              onChange={(value) => update("enableFog", value)}
            />
          </SettingsRow>

          {/* Fog  Content */}

          {/* Fog Color */}
          <div className="flex h-10 items-center justify-between rounded bg-[#242323] px-2 text-sm text-white">
            <span>Fog Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.fogColor}
                onChange={(event) => update("fogColor", event.target.value)}
                className="h-9 w-10 cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={settings.fogColor}
                onChange={(event) => update("fogColor", event.target.value)}
                className="w-20 bg-transparent text-right outline-none"
              />
            </div>
          </div>

          {/* Fog Start */}
          <SliderField
            label="Fog Start"
            min={0}
            max={100}
            step={1}
            decimals={3}
            value={settings.fogStart}
            onChange={(value) => update("fogStart", value)}
          />
          
          {/* Fog End */}

          
          <SliderField
            label="Fog End"
            min={0}
            max={500}
            step={1}
            decimals={3}
            value={settings.fogEnd}
            onChange={(value) => update("fogEnd", value)}
          />
        </SettingsSection>

        {/* Utilities  */}
        <SettingsSection
          name="Utilities"
          open={utilitiesOpen}
          onClick={() => setUtilitiesOpen((value) => !value)}
        >
          <SettingsRow label="Enable OIT">
            <Toggle
              checked={settings.enableOIT}
              onChange={(value) => update("enableOIT", value)}
            />
          </SettingsRow>
          <SettingsRow label="Show Bounding Boxes">
            <Toggle
              checked={settings.enableBoundingBox}
              onChange={(value) => update("enableBoundingBox", value)}
            />
          </SettingsRow>
          {/* Show Wireframe  */}
          <SettingsRow label="Show Wireframe">
            <Toggle
              checked={settings.enableWireframe}
              onChange={(value) => update("enableWireframe", value)}
            />
          </SettingsRow>
        </SettingsSection>

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
