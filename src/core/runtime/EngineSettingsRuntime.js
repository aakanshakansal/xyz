export function getStoredEngineSettings() {
  try {
    const value = JSON.parse(localStorage.getItem("Badvisor_Engine_Settings") || "null");
    return { resolution : "HD", webGPU: false, notes: "", ...(value || {}) };
  }
    catch {
    return { resolution : "HD", webGPU: false, notes: "" };
  }
}

export function isWebGPURequested (){
  return Boolean(getStoredEngineSettings().webGPU);
}


export function applyEngineSettings(runtime, settings = {}) {

    if (!runtime?.gl) return;
    

    const devicePixelRatio = window.devicePixelRatio || 1;
    const resolution = settings.resolution || "HD";

    const scale = resolution === "SD" ? 0.5 : resolution === "Medium" ? 0.75:  1;

    runtime.gl.setPixelRatio(Math.max(0.5, devicePixelRatio * scale));

    const canvas = runtime.gl.domElement;
    if(canvas?.clientWidth && canvas?.clientHeight){
        runtime.gl.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }
}