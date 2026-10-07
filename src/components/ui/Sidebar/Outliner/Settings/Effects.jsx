import { useEffect, useState } from "react";
import FloatingCard from "../../../common/FloatingCard";
import { WiStars } from "react-icons/wi";
import { SettingsRow, SettingsSection, SliderField, Toggle } from "../../../common/SettingsControls";

const Storage_key= "Badvisor_Effects_Settings";
const Defaults = {
  imageProcessing: {
    enabled: false,
    exposure: 1,
    contrast: 1,
    colorCurves: {
      globalHue: 0,
      globalDensity: 0,
      globalSaturation: 0,
      highlightsHue: 0,
      highlightsDensity: 0,
      highlightsSaturation: 0,
      shadowsHue: 0,
      shadowsDensity: 0,
      shadowsSaturation: 0,
    },
    colorGradientEnabled: false,
    colorGradientTexture: null,
    toneMappingEnabled: false,
    toneMappingType: "ACES",
    vignetteEnabled: false,
    vignetteColor: "#000000",
    vignetteWeight: 1,
    vignetteStretch: 1,
  },
  ssao: {
    enabled: false,
    base: 0,
    bilateralSamples: 64,
    bilateralSoften: 1,
    bilateralTolerance: 2,
    maxZ: 100,
    minZAspect: 1,
    radius: 0.1,
    totalStrength: 1,
  },
  ssr: {
    enabled: false,
    thickness: 0.018,
    automaticThickness: true,
    reflectivityThreshold: 0.04,
    useFrensel: true,
    roughnessFactor: 0.5,
    maxSteps: 20,
    maxDistance: 100,
    smoothReflections: true,
    attenuateScreenBorders: true,
    step: 1,
    ssrDownSample: 1,
    blurDownsample: 1,
    blurDispersionStrength: 0.01,
    selfCollisionNumSkip: 0,
    samples: 64,
    debug: false,
  },
  glow: {
    enabled: false,
    intensity: 0.5,
    blurKernelSize: 64,
  },
  bloom: {
    enabled: false,
    kernel: 64,
    scale: 1,
    threshold: 1,
    weight: 0.5,
  },
  chromaticAbberation: {
    enabled: false,
    amount: 0.1,
  },
  depthOfField: {
    enabled: false,
    blurLevel: 1,
    fStop: 1.4,
    focalLength: 50,
    focusDistance: 10,
    lensSize: 50, 
  },
  antiAliasing: {
    fxaaEnabled: false,
  },
  grain: {
    enabled: false,
    intensity: 0.1,
    animated: false,
  },
  sharpen: {
    enabled: false,
    colorAmount: 0.5,
    edgeAmount: 0.5,
  },
  notes:"",
};

function merge(a,b){
    if(!b || typeof b !=="object") return structuredClone(a);
    const out = structuredClone(a);
    for (const [k,v] of Object.entries(b)){
        if(v && typeof v === "object" && !Array.isArray(v) && out[k] === "object")
            out[k]= merge(out[k],v);
        else 
            out[k]=v;
    }
    return out;
}
function readStoredSettings(){
    try{
        return merge(Defaults, JSON.parse(localStorage.getItem(Storage_key) || "null") || {})
    }
    catch {
        return structuredClone(Defaults);
    }
}


export default function Effects({  onClose, threeRuntime }) {
  const [settings, setSettings ] = useState(readStoredSettings)

    const [open, setOpen] = useState("Image Processing");
    useEffect(()=>{
      localStorage.setItem(Storage_key, JSON.stringify(settings))
      if(threeRuntime){
        threeRuntime.effectSettings = settings;
        threeRuntime.effects?.update?.(settings, threeRuntime.sceneSettings || {})
      }
    },[settings, threeRuntime])

    const set = (path , value) =>{
      setSettings((prev)=>{
        const next = structuredClone(prev);
        let cursor= next;
        const parts = path.split(".");

        parts.slice(0, -1)
        .forEach((p)=>{
          cursor = cursor[p];
        })
        cursor[parts.at(-1)] = value;
        return next;
      })
    }

    const toggle = (name) =>{
      setOpen((value)=>
      value === name
    ? null
  : name
)
    }

    const curves = settings.imageProcessing.colorCurves

    const img = settings.imageProcessing

    const ssao = settings.ssao

    const ssr = settings.ssr

    const glow = settings.glow

    const bloom = settings.bloom

    const chrom = settings.chromaticAbberation

    const dof = settings.depthOfField

    const grain = settings.grain

    const sharp = settings.sharpen

  return (
    <FloatingCard
      title="Effects"
      icon={<WiStars size={25} />}
      width={400}
      initialPosition={{
        x: 50,
        y: 150,
      }}
      onClose={onClose}
    >
      <div className="max-h-[calc(100vh-180px)] space-y-1 overflow-y-auto p-2">
        {/* Image Processing  */}
        <SettingsSection
          name="Image Processing"
          open={open === "Image Processing"}
          onClick={() => toggle("Image Processing")}
        >
          <SettingsRow label="Enable Effects">
            <Toggle
              checked={curves.enabled}
              onChange={(v) => set("imageProcessing.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Exposure"
            value={curves.exposure}
            onChange={(v) => set("imageProcessing.exposure", v)}
            min={0}
            max={5}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Contrast"
            value={curves.contrast}
            onChange={(v) => set("imageProcessing.contrast", v)}
            min={0}
            max={5}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Global Hue"
            value={curves.globalHue}
            onChange={(v) => set("imageProcessing.colorCurves.globalHue", v)}
            min={-180}
            max={180}
            step={1}
            decimals={3}
          />
          <SliderField
            label="Global Density"
            value={curves.globalDensity}
            onChange={(v) =>
              set("imageProcessing.colorCurves.globalDensity", v)
            }
            min={-1}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Global Saturation"
            value={curves.globalSaturation}
            onChange={(v) =>
              set("imageProcessing.colorCurves.globalSaturation", v)
            }
            min={-1}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Highlights Hue"
            value={curves.highlightsHue}
            onChange={(v) =>
              set("imageProcessing.colorCurves.highlightsHue", v)
            }
            min={-180}
            max={180}
            step={1}
            decimals={3}
          />
          <SliderField
            label="Highlights Density"
            value={curves.highlightsDensity}
            onChange={(v) =>
              set("imageProcessing.colorCurves.highlightsDensity", v)
            }
            min={-1}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Highlights Saturation"
            value={curves.highlightsSaturation}
            onChange={(v) =>
              set("imageProcessing.colorCurves.highlightsSaturation", v)
            }
            min={-1}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Shadow Hue"
            value={curves.shadowHue}
            onChange={(v) => set("imageProcessing.colorCurves.shadowHue", v)}
            min={-180}
            max={180}
            step={1}
            decimals={3}
          />
          <SliderField
            label="Shadow Density"
            value={curves.shadowDensity}
            onChange={(v) =>
              set("imageProcessing.colorCurves.shadowDensity", v)
            }
            min={-1}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Shadow Saturation"
            value={curves.shadowSaturation}
            onChange={(v) =>
              set("imageProcessing.colorCurves.shadowSaturation", v)
            }
            min={-1}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SettingsRow label="Enable Tone Mapping">
            <Toggle
              checked={img.toneMappingEnabled}
              onChange={(v) => set("imageProcessing.toneMappingEnabled", v)}
            />
          </SettingsRow>
          <SettingsRow label="Tone Mapping Type">
            <select
              value={curves.toneMappingType}
              onChange={(e) =>
                set("imageProcessing.toneMappingType", e.target.value)
              }
              className="rounded bg-[#555555] px-2 py-1"
            >
              <option>Standard</option>
              <option>Khronos PBR Material</option>
              <option>ACES</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Enable Vignette">
            <Toggle
              checked={img.vignetteEnabled}
              onChange={(v) => set("imageProcessing.vignetteEnabled", v)}
            />
          </SettingsRow>
          {img.vignetteEnabled && (
            <>
              <SettingsRow label="Vignette Color">
                <input
                  type="color"
                  value={curves.vignetteColor}
                  onChange={(e) =>
                    set("imageProcessing.vignetteColor", e.target.value)
                  }
                />
              </SettingsRow>
              <SliderField
                label="Weight"
                value={curves.vignetteWeight}
                onChange={(v) => set("imageProcessing.vignetteWeight", v)}
                min={0}
                max={3}
                step={0.001}
                decimals={3}
              />
              <SliderField
                label="Stretch"
                value={curves.vignetteStretch}
                onChange={(v) => set("imageProcessing.vignetteStretch", v)}
                min={0.01}
                max={5}
                step={0.001}
                decimals={3}
              />
            </>
          )}
        </SettingsSection>
        {/* SSAO */}
        <SettingsSection
          name="SSAO"
          open={open === "SSAO"}
          onClick={() => toggle("SSAO")}
        >
          <SettingsRow label="Enable SSAO">
            <Toggle
              checked={ssao.enabled}
              onChange={(v) => set("ssao.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Base"
            value={ssao.base}
            onChange={(v) => set("ssao.base", v)}
            min={0}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Bilateral Samples"
            value={ssao.bilateralSamples}
            onChange={(v) => set("ssao.bilateralSamples", v)}
            min={1}
            max={128}
            step={1}
            decimals={0}
          />
          <SliderField
            label="Bilateral Soften"
            value={ssao.bilateralSoften}
            onChange={(v) => set("ssao.bilateralSoften", v)}
            min={0}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Bilateral Tolerance"
            value={ssao.bilateralTolerance}
            onChange={(v) => set("ssao.bilateralTolerance", v)}
            min={0}
            max={10}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Max Z"
            value={ssao.maxZ}
            onChange={(v) => set("ssao.maxZ", v)}
            min={1}
            max={500}
            step={1}
            decimals={3}
          />
          <SliderField
            label="Min Z Aspect"
            value={ssao.minZAspect}
            onChange={(v) => set("ssao.minZAspect", v)}
            min={0}
            max={5}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Radius"
            value={ssao.radius}
            onChange={(v) => set("ssao.radius", v)}
            min={0}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Strength"
            value={ssao.totalStrength}
            onChange={(v) => set("ssao.totalStrength", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
        </SettingsSection>
        {/* Screen Reflection */}
        <SettingsSection
          name="Screen Reflection"
          open={open === "Screen Reflection"}
          onClick={() => toggle("Screen Reflection")}
        >
          <SettingsRow label="Enable SSR">
            <Toggle
              checked={ssr.enabled}
              onChange={(v) => set("ssr.enabled", v)}
            />
          </SettingsRow>

          <SliderField
            label="Thickness"
            value={ssr.thickness}
            onChange={(v) => set("ssr.thickness", v)}
            min={0.001}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SettingsRow label="Automatic Thickness">
            <Toggle
              checked={ssr.automaticThickness}
              onChange={(v) => set("ssr.automaticThickness", v)}
            />
          </SettingsRow>
          <SliderField
            label="Reflectivity Threshold"
            value={ssr.reflectivityThreshold}
            onChange={(v) => set("ssr.reflectivityThreshold", v)}
            min={0}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SettingsRow label="Use Frensel">
            <Toggle
              checked={ssr.useFrensel}
              onChange={(v) => set("ssr.useFrensel", v)}
            />
          </SettingsRow>
          <SliderField
            label="Roughness Factor"
            value={ssr.roughnessFactor}
            onChange={(v) => set("ssr.roughnessFactor", v)}
            min={0}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Max Steps"
            value={ssr.maxSteps}
            onChange={(v) => set("ssr.maxSteps", v)}
            min={1}
            max={128}
            step={1}
            decimals={0}
          />
          <SliderField
            label="Max Distance"
            value={ssr.maxDistance}
            onChange={(v) => set("ssr.maxDistance", v)}
            min={1}
            max={500}
            step={1}
            decimals={0}
          />
          <SettingsRow label="Smooth Reflections">
            <Toggle
              checked={ssr.smoothReflections}
              onChange={(v) => set("ssr.smoothReflections", v)}
            />
          </SettingsRow>
          <SettingsRow label="Attenuate Screen Borders">
            <Toggle
              checked={ssr.attenuateScreenBorders}
              onChange={(v) => set("ssr.attenuateScreenBorders", v)}
            />
          </SettingsRow>
          <SliderField
            label="Step"
            value={ssr.step}
            onChange={(v) => set("ssr.step", v)}
            min={0}
            max={5}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="SSR DownSample"
            value={ssr.ssrDownSample}
            onChange={(v) => set("ssr.ssrDownSample", v)}
            min={0.1}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Blur Downsample"
            value={ssr.blurDownsample}
            onChange={(v) => set("ssr.blurDownsample", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Blur Dispersion Strength"
            value={ssr.blurDispersionStrength}
            onChange={(v) => set("ssr.blurDispersionStrength", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Self Collision Num Skip"
            value={ssr.selfCollisionNumSkip}
            onChange={(v) => set("ssr.selfCollisionNumSkip", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Sample"
            value={ssr.samples}
            onChange={(v) => set("ssr.samples", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
          <SettingsRow label="Debug">
            <Toggle checked={ssr.debug} onChange={(v) => set("ssr.debug", v)} />
          </SettingsRow>
        </SettingsSection>
        {/* Glow */}
        <SettingsSection
          name="Glow"
          open={open === "Glow"}
          onClick={() => toggle("Glow")}
        >
          <SettingsRow label="Enable Glow">
            <Toggle
              checked={glow.enabled}
              onChange={(v) => set("glow.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Intensity"
            value={glow.intensity}
            onChange={(v) => set("glow.intensity", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Blur"
            value={glow.blurKernelSize}
            onChange={(v) => set("glow.blurKernelSize", v)}
            min={1}
            max={128}
            step={1}
            decimals={0}
          />
        </SettingsSection>
        {/* Bloom */}
        <SettingsSection
          name="Bloom"
          open={open === "Bloom"}
          onClick={() => toggle("Bloom")}
        >
          <SettingsRow label="Enable Bloom">
            <Toggle
              checked={bloom.enabled}
              onChange={(v) => set("bloom.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Kernel"
            value={bloom.kernel}
            onChange={(v) => set("bloom.kernel", v)}
            min={1}
            max={128}
            step={1}
            decimals={0}
          />
          <SliderField
            label="Scale"
            value={bloom.scale}
            onChange={(v) => set("bloom.scale", v)}
            min={0}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Threshold"
            value={bloom.threshold}
            onChange={(v) => set("bloom.threshold", v)}
            min={0}
            max={5}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Weight"
            value={bloom.weight}
            onChange={(v) => set("bloom.weight", v)}
            min={0}
            max={3}
            step={0.001}
            decimals={3}
          />
        </SettingsSection>
        {/* Chromatic Abberation  */}
        <SettingsSection
          name="Chromatic Abberation"
          open={open === "Chromatic Abberation"}
          onClick={() => toggle("Chromatic Abberation")}
        >
          <SettingsRow label="Enable Chromatic Abberation">
            <Toggle
              checked={chrom.enabled}
              onChange={(v) => set("chromaticAbberation.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Amount"
            value={chrom.amount}
            onChange={(v) => set("chromaticAbberation.amount", v)}
            min={1}
            max={1}
            step={0.001}
            decimals={0}
          />
        </SettingsSection>
        {/* Depth of Field  */}
        <SettingsSection
          name="Depth of Field"
          open={open === "Depth of Field"}
          onClick={() => toggle("Depth of Field")}
        >
          <SettingsRow label="Enable DoF">
            <Toggle
              checked={dof.enabled}
              onChange={(v) => set("depthOfField.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Blur Level"
            value={dof.blurLevel}
            onChange={(v) => set("depthOfField.blurLevel", v)}
            min={0}
            max={2}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="fStop"
            value={dof.fStop}
            onChange={(v) => set("depthOfField.fStop", v)}
            min={0.1}
            max={10}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Focal Length"
            value={dof.focalLength}
            onChange={(v) => set("depthOfField.focalLength", v)}
            min={1}
            max={200}
            step={1}
            decimals={0}
          />
          <SliderField
            label="Focus Distance"
            value={dof.focusDistance}
            onChange={(v) => set("depthOfField.focusDistance", v)}
            min={1}
            max={500}
            step={1}
            decimals={0}
          />
          <SliderField
            label="Lens Size"
            value={dof.lensSize}
            onChange={(v) => set("depthOfField.lensSize", v)}
            min={1}
            max={200}
            step={1}
            decimals={0}
          />
        </SettingsSection>
        {/* Anti Aliasing  */}
        <SettingsSection
          name=" Anti Aliasing"
          open={open === " Anti Aliasing"}
          onClick={() => toggle(" Anti Aliasing")}
        >
          <SettingsRow label="Enable FXAA">
            <Toggle
              checked={settings.antiAliasing.fxaaEnabled}
              onChange={(v) => set("antiAliasing.fxaaEnabled", v)}
            />
          </SettingsRow>
        </SettingsSection>
        {/* Grain */}
        <SettingsSection
          name="Grain"
          open={open === "Grain"}
          onClick={() => toggle("Grain")}
        >
          <SettingsRow label="Enable Grain">
            <Toggle
              checked={grain.enabled}
              onChange={(v) => set("grain.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Intensity"
            value={grain.intensity}
            onChange={(v) => set("grain.intensity", v)}
            min={0}
            max={10}
            step={0.01}
            decimals={3}
          />
          <SettingsRow label="Animated">
            <Toggle
              checked={grain.animated}
              onChange={(v) => set("grain.animated", v)}
            />
          </SettingsRow>
        </SettingsSection>
        {/* Sharpen */}

        <SettingsSection
          name="Sharpen"
          open={open === "Sharpen"}
          onClick={() => toggle("Sharpen")}
        >
          <SettingsRow label="Enable Sharpen">
            <Toggle
              checked={sharp.enabled}
              onChange={(v) => set("sharpen.enabled", v)}
            />
          </SettingsRow>
          <SliderField
            label="Color Amount"
            value={sharp.colorAmount}
            onChange={(v) => set("sharpen.colorAmount", v)}
            min={0}
            max={1}
            step={0.001}
            decimals={3}
          />
          <SliderField
            label="Edge Amount"
            value={sharp.edgeAmount}
            onChange={(v) => set("sharpen.edgeAmount", v)}
            min={0}
            max={2}
            step={0.001}
            decimals={0}
          />
        </SettingsSection>
      </div>
    </FloatingCard>
  );
}
