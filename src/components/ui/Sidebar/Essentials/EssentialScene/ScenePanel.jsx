import { SettingsRow, SliderField, Toggle } from "../../../common/SettingsControls";
import { FaCamera } from "react-icons/fa";

const Default_Scene = {
  background: {
    enabled: false,
    color: "#ff0000",
  },
  camera_Feature: {
    name: "",
    distance: 0,
    horizontalAngle: 0,
    verticalAngle: 0,
  },
  mouse: {
    parallaxEnabled: false,
    parallaxSensitivity: 0,
    orbitEnabled: false,
    orbitSensitivityAlpha: 0,
    orbitSensitivityBeta: 0,
  },
};
const settings = Default_Scene.background

const camera = Default_Scene.camera_Feature

const effects = Default_Scene.mouse;

export default function ScenePanel() {
  return (
    <div className="max-h-[calc(100vh-180px)]  flex flex-col px-2 gap-2 py-3  text-sm overflow-y-auto ">
      {/* Settings */}
      <div className="space-y-2 bg-[#302e2e] text-white rounded-md p-2">
        <h1>Settings</h1>
        <SettingsRow label="Transparent Background">
          <Toggle checked={settings.enabled} />
        </SettingsRow>
        <div className="flex h-10 w-full items-center justify-between rounded  px-2  bg-[#242323]  ">
          <span>Background Color</span>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.color}
              className="h-9 w-10 cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={settings.color}
              className="w-20 bg-transparent text-right outline-none"
            />
          </div>
        </div>
      </div>

      {/* Camera */}

      <div className="space-y-2 bg-[#302e2e]  text-white rounded-md p-2 ">
        <div className="flex flex-row gap-2 items-center p-1">
          <span>
            {" "}
            <FaCamera />
          </span>
          <h1> Camera</h1>
        </div>
        <SettingsRow label="Name">
          <input type="text" value={camera.name} />
        </SettingsRow>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-evenly rounded  px-2 text-sm bg-[#242323]"
        >
          Set From View
        </button>
        <SliderField
          label="Distance"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={camera.distance}
        />
        <SliderField
          label="Horizontal Angle"
          min={0}
          max={180}
          step={1}
          decimals={3}
          value={camera.horizontalAngle}
        />
        <SliderField
          label="Vertical Angle"
          min={0}
          max={180}
          step={1}
          decimals={3}
          value={camera.verticalAngle}
        />
      </div>

      {/* Effects */}

      <div className="space-y-2 bg-[#302e2e] text-white rounded-md p-2">
        <h1>Effects</h1>
        <SettingsRow label="Mouse Hover Parallax Effect">
          <Toggle checked={effects.parallaxEnabled} />
        </SettingsRow>
        <SliderField
          label="Mouse Hover Parallax Sensitivity"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={effects.parallaxSensitivity}
        />
        <SettingsRow label="Mouse Hover Orbit Effect">
          <Toggle checked={effects.orbitEnabled} />
        </SettingsRow>
        <SliderField
          label="Mouse Hover Orbit Sensitivity Alpha"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={effects.orbitSensitivityAlpha}
        />
        <SliderField
          label="Mouse Hover Orbit Sensitivity Beta"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={effects.orbitSensitivityBeta}
        />
       
      </div>
    </div>
  );
}