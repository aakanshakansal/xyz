import { Canvas } from '@react-three/fiber'
import {  Splat } from '@react-three/drei'
import Model from './Model'
import Lights from './Lights'
import PerformanceStats from "./PerformanceStats";
import { Suspense, useEffect, useRef, useCallback, } from "react";
import ThreeDText from '../ui/Sidebar/Elements/ThreeDText'
import { InteractionBridge } from '../../core/bridge/InteractionBridge';
import { reapplySceneSettings } from '../../core/runtime/SceneSettingsRuntime';
import { getStoredEngineSettings } from "../../core/runtime/EngineSettingsRuntime";
import { EffectsBridge } from '../../core/bridge/EffectsBridge';
import { OrbitControlsBridge } from '../../core/bridge/OrbitControlsBridge';
import { SceneBridge } from '../../core/bridge/SceneBridge';
import { SceneKeyboardControls } from '../../core/bridge/SceneKeyboardControls';

export default function Scene({ 
  onStatsUpdate, 
  onSceneReady, 
  onSceneChanged, 
  runTimeText =[], 
  runtimeSplats=[],
 }) {

  const runtimeRef = useRef(null);
  useEffect(()=>{
    if(!runtimeSplats.length) return;

    const id = requestAnimationFrame(()=> onSceneChanged?.());
    return ()=> cancelAnimationFrame(id)
  },[runtimeSplats, onSceneChanged])


  const handleModelLoaded = useCallback(()=>{
    reapplySceneSettings(runtimeRef.current);
    onSceneChanged?.();
  },[onSceneChanged]);


  return (
    <div className="viewer-canvas h-full w-full min-h-0 min-w-0">
      <Canvas
        key={getStoredEngineSettings().webGPU ? "webgpu" : "webgl"}
        camera={{
          position: [0, 5, 5],
          fov: 20,
          near: 0.1,
          far: 1000,
        }}
        gl={
          getStoredEngineSettings().webGPU
            ? async (defaults) => {
                try {
                  const { WebGPURenderer } = await import("three/webgpu");

                  const renderer = new WebGPURenderer({
                    ...defaults,
                    antialias: true,
                    alpha: true,
                  });
                  await renderer.init();
                  return renderer;
                } catch (error) {
                  console.warn(
                    "WebGPU Initialization Failed. Getting back to WebGL.",
                    error,
                  );
                  const { WebGLRenderer } = await import("three");

                  return new WebGLRenderer({
                    ...defaults,
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true,
                  });
                }
              }
            : {
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: true,
              }
        }
      >
        <SceneBridge onSceneReady={onSceneReady} runtimeRef={runtimeRef} />
        <EffectsBridge runtimeRef={runtimeRef} />

        <InteractionBridge
          runtimeRef={runtimeRef}
          onSceneChanged={onSceneChanged}
        />

        <SceneKeyboardControls runtimeRef={runtimeRef} />
        <gridHelper
          args={[10, 10]}
          position={[0, -1, 0]}
          color="white"
          userData={{
            isEditorHelper: true,
            badvisorIgnorePicking: true,
          }}
        />

        <Lights />
        <Suspense fallback={null}>
          <Model onLoaded={handleModelLoaded} />
          {runTimeText.map((textNode) => (
            <ThreeDText key={textNode.id} {...textNode} />
          ))}
          {runtimeSplats.map((splat) => (
            <Splat
              key={splat.id}
              src={splat.url}
              name={splat.name}
              position={[0, 0, 0]}
              alphaTest={0.1}
            />
          ))}
        </Suspense>

        <OrbitControlsBridge runtimeRef={runtimeRef} />
        <PerformanceStats onUpdate={onStatsUpdate} />
      </Canvas>
    </div>
  );
}