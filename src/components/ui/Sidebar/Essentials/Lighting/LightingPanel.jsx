import { SliderField } from "../../../common/SettingsControls";
import { FaPlus } from "react-icons/fa";

const Defaults_Lights ={
    envMap:{
        envIntensity:0,
        rotateY: 0,
    }

}

const environment = Defaults_Lights.envMap

export default function LightingPanel ()  {
  return (
    <div className="max-h-[calc(100vh-180px)]  flex flex-col px-2 gap-2 py-3  text-sm overflow-y-auto ">
      {/* Environment Map  */}
      <div className="space-y-2 bg-[#302e2e] text-white rounded-md p-2">
        <h1>Environment Map</h1>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-evenly rounded  px-2 text-sm bg-[#242323]"
        >
          Studio env
        </button>

        <SliderField
          label="Env Intensity"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={environment.envIntensity}
        />

        <SliderField
          label="Rotation Y"
          min={0}
          max={100}
          step={1}
          decimals={3}
          value={environment.rotateY}
        />
      </div>
      <div className="shrink-0 border-b border-gray-800 px-[0.8vw] py-[0.8vh]">
        <button
          type="button"
        
          className="flex h-[4vh] min-h-8 w-full items-center justify-center gap-[0.5vw] rounded-md py-[0.6vh] text-[1vw] min-[1920px]:text-[0.68vw] font-semibold text-[#34c5b7] transition hover:bg-[#34c5b7]/10 disabled:cursor-wait disabled:opacity-50"
        >
          <span className="text-[1.5vw] min-h-4 min-w-4 leading-none"><FaPlus size={15}/></span>
         Add 3D Light
        </button>
      </div>
    </div>
  );
}
