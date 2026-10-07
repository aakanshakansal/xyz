import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiUpload,
  FiX,
} from "react-icons/fi";
import * as THREE from "three";
import {
  getExtension,
  getFileStem,
  load3DAsset,
} from "../../../../utils/assetLoader"
import { FaPlus } from "react-icons/fa";

function isSceneObject(object) {
  if (!object) return false;
  if (object.isLight || object.isCamera) return false;
  if (object.type === "GridHelper" || object.type === "AxesHelper")
    return false;
  return object.isObject3D === true;
}

function getChildren(object) {
  return object?.children?.filter(isSceneObject) ?? [];
}

function getName(object) {
  return object?.name?.trim() || object?.type || "Object";
}

function ObjectRow({
  object,
  level,
  selectedObject,
  expandedNodes,
  onSelect,
  onToggleExpanded,
  onToggleVisibility,
}) {
  const children = getChildren(object);
  const hasChildren = children.length > 0;
  const expanded = expandedNodes[object.uuid] === true;
  const selected = selectedObject?.uuid === object.uuid;
  const name = getName(object);

  return (
    <div className="min-w-0">
      <div
        className={`group flex min-w-0 gap-[0.8vw] items-center border-l-2 ${
          selected
            ? "border-[#34c5b7] bg-[#34c5b7]/15"
            : "border-transparent hover:bg-white/[0.08]"
        }`}
        style={{ paddingLeft: `${Math.min(level, 12) * 0.65}vw` }}
      >
        <button
          type="button"
          disabled={!hasChildren}
          aria-label={expanded ? "Collapse" : "Expand"}
          onClick={() => hasChildren && onToggleExpanded(object.uuid)}
          className={`flex h-[2.8vh] w-[2.8vh] min-h-6 min-w-6 shrink-0 items-center justify-center ${
            hasChildren ? "text-gray-500 hover:text-white" : "text-transparent"
          }`}
        >
          {hasChildren &&
            (expanded ? (
              <FiChevronDown className="h-[1vw] w-[1vw] min-h-3 min-w-3" />
            ) : (
              <FiChevronRight className="h-[1vw] w-[1vw] min-h-3 min-w-3" />
            ))}
        </button>

        <span
          className={`h-[0.3vw] w-[0.3vw] min-h-2 min-w-2 shrink-0 rounded-full ${
            object.isMesh ? "bg-[#34c5b7]" : "bg-gray-500"
          }`}
        />

        <button
          type="button"
          onClick={() => onSelect(object)}
          className="min-w-0 flex-1 py-[0.7vh] pr-[0.2vw] text-left"
          title={name}
        >
          <div className="flex min-w-0 items-center gap-[0.5vw]">
            <span
              className={`min-w-0 flex-1 truncate text-[0.9vw] min-[1920px]:text-[0.9vw] ${
                selected ? "font-semibold text-[#34c5b7]" : "text-gray-400"
              }`}
            >
              {name}
            </span>

            {object.isMesh && (
              <span className="shrink-0 text-[0.7vw] min-[1920px]:text-[0.6vw] text-gray-600">
                Mesh
              </span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onToggleVisibility(object)}
          className="mr-[0.4vw] flex h-[2.4vh] w-[2.4vh] min-h-6 min-w-6 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white"
          title={object.visible ? "Hide" : "Show"}
          aria-label={object.visible ? `Hide ${name}` : `Show ${name}`}
        >
          {object.visible ? (
            <FiEye className="h-[0.8vw] w-[0.8vw] min-h-3 min-w-3" />
          ) : (
            <FiEyeOff className="h-[0.8vw] w-[0.8vw] min-h-3 min-w-3 text-gray-600" />
          )}
        </button>
      </div>

      {expanded &&
        children.map((child) => (
          <ObjectRow
            key={child.uuid}
            object={child}
            level={level + 1}
            selectedObject={selectedObject}
            expandedNodes={expandedNodes}
            onSelect={onSelect}
            onToggleExpanded={onToggleExpanded}
            onToggleVisibility={onToggleVisibility}
          />
        ))}
    </div>
  );
}

function Add3DElementModel({
  onClose,
  onAddAsset,
  onAddText,
  onAddPhotoDome,
  isAdding,
}) {
  const assetInputRef = useRef(null);
  const photoInputRef = useRef(null);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-[1vw] backdrop-blur-[1px]">
      <div className="flex max-h-[82vh] w-[42vw] max-w-[92vw]  flex-col overflow-hidden rounded-lg bg-[#2d2d2d] shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-[1vw] py-[1vh]">
          <div className="min-w-0 pr-[0.8vw]">
            <h3 className="text-[1.1vw] min-[1920px]:text-[0.9vw] font-semibold text-[#34c5b7]">
              Add 3D Element
            </h3>
            <p className="mt-[0.7vh] max-w-[34vw] text-[0.9vw] min-[1920px]:text-[0.8vw] leading-relaxed text-gray-400">
              Add a 3D asset, create 3D text, or choose an image for a photo
              dome.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAdding}
            className="flex h-[2.8vh] w-[2.8vh] min-h-6 min-w-6 shrink-0 items-center justify-center rounded text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Close"
          >
            <FiX className="h-[0.9vw] w-[0.9vw] min-h-3 min-w-3" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-[0.8vw]">
          <div className="grid grid-cols-1 gap-[0.8vw] min-[900px]:grid-cols-2">
            <button
              type="button"
              onClick={() => assetInputRef.current?.click()}
              disabled={isAdding}
              className="group flex min-h-[20vh] flex-col rounded-md bg-[#090909] p-[0.9vw] text-left transition hover:bg-[#111] disabled:opacity-50"
            >
              <span className="text-[1vw] min-[1920px]:text-[0.68vw] font-semibold text-white">
                3D Asset
              </span>
              <span className="flex flex-1 items-center justify-center text-[#34c5b7]">
                <FiUpload
                  className="h-[2.2vw] w-[2.2vw] min-h-8 min-w-8"
                  strokeWidth={1.5}
                />
              </span>
              <span className="text-[0.8vw] min-[1920px]:text-[0.62vw] leading-relaxed text-gray-300">
                GLB, GLTF, OBJ, STL, VRM, SPLAT or FBX
              </span>
              {/* <span className="mt-[0.4vh] text-[0.7vw] min-[1920px]:text-[0.48vw] text-gray-600">
                Select multiple files when a GLTF/OBJ asset has external dependencies.
              </span> */}
            </button>

            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isAdding}
              className="group flex min-h-[20vh] flex-col rounded-md bg-[#090909] p-[0.9vw] text-left transition hover:bg-[#111] disabled:opacity-50"
            >
              <span className="text-[1vw] min-[1920px]:text-[0.68vw] font-semibold text-white">
                Photo Dome
              </span>
              <span className="flex flex-1 items-center justify-center text-[#34c5b7]">
                <FiGlobe
                  className="h-[2.2vw] w-[2.2vw] min-h-8 min-w-8"
                  strokeWidth={1.5}
                />
              </span>
              <span className="text-[0.8vw] min-[1920px]:text-[0.62vw] leading-relaxed text-gray-300">
                Choose an image
              </span>
            </button>

            <button
              type="button"
              onClick={onAddText}
              disabled={isAdding}
              className="group flex min-h-[20vh] flex-col rounded-md bg-[#090909] p-[0.9vw] text-left transition hover:bg-[#111] disabled:opacity-50"
            >
              <span className="text-[1vw] min-[1920px]:text-[0.68vw] font-semibold text-white">
                3D Text
              </span>
              <span className="flex flex-1 items-center justify-center text-[2.2vw] font-semibold text-[#34c5b7]">
                T
              </span>
              <span className="text-[0.8vw] min-[1920px]:text-[0.62vw] leading-relaxed text-gray-300">
                Create 3D text
              </span>
            </button>
          </div>
        </div>

        <input
          ref={assetInputRef}
          type="file"
          multiple
          accept=".glb,.gltf,.bin,.obj,.mtl,.stl,.vrm,.splat,.fbx"
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length) onAddAsset(files);
            event.target.value = "";
          }}
        />

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onAddPhotoDome(file);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export default function ThreeDView({
  threeRuntime,
  sceneVersion,
  onSceneChanged,
  onAddSplat,
  onAdd3DText,
}) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [showAddModel, setShowAddModel] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const rootObjects = useMemo(() => {
    const scene = threeRuntime?.scene;
    if (!scene) return [];
    return scene.children.filter(isSceneObject);
  }, [threeRuntime?.scene, sceneVersion]);

  useEffect(() => {
    if (!rootObjects.length) return;

    const next = {};
    const expandToDepth = (object, depth) => {
      const children = getChildren(object);
      if (!children.length || depth <= 0) return;
      next[object.uuid] = true;
      children.forEach((child) => expandToDepth(child, depth - 1));
    };

    rootObjects.forEach((object) => expandToDepth(object, 3));
    setExpandedNodes((previous) => ({ ...previous, ...next }));
  }, [rootObjects, sceneVersion]);

  const toggleExpanded = (uuid) => {
    setExpandedNodes((previous) => ({
      ...previous,
      [uuid]: !previous[uuid],
    }));
  };

  const toggleVisibility = (object) => {
    object.visible = !object.visible;
    object.updateMatrixWorld(true);
    onSceneChanged?.();
    setSelectedObject((current) =>
      current?.uuid === object.uuid ? object : current,
    );
  };

  const addAsset = async (files) => {
    if (!threeRuntime?.scene || !files?.length) return;

    const extension = getExtension(files[0].name);

    if (extension === "splat") {
      onAddSplat?.(files[0]);
      setShowAddModel(false);
      return;
    }

    setIsAdding(true);

    try {
      const model = await load3DAsset(files);
      model.name = getFileStem(files[0].name);
      model.position.set(0, 0, 0);

      threeRuntime.scene.add(model);
      setExpandedNodes((previous) => ({
        ...previous,
        [model.uuid]: true,
      }));
      setSelectedObject(model);
      onSceneChanged?.();
      setShowAddModel(false);
    } catch (error) {
      console.error(`Failed to load .${extension} asset:`, error);
      window.alert(
        `Could not load ${files[0].name}.\n\n${error?.message || "The file may be invalid or may require additional dependent files."}`,
      );
    } finally {
      setIsAdding(false);
    }
  };

  const addText = () => {
    if (!threeRuntime?.scene) return;

    const text = window.prompt("Enter 3D text", "Badvisor");
    if (!text?.trim()) return;

    onAdd3DText?.({
      text: text.trim(),
      font: "Helvetiker Regular",
      resolution: 16,
    });
    setShowAddModel(false);
  };

  const addPhotoDome = async (file) => {
    if (!threeRuntime?.scene) return;

    setIsAdding(true);

    try {
      const url = URL.createObjectURL(file);
      const texture = await new THREE.TextureLoader().loadAsync(url);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      if (threeRuntime.scene.background?.isTexture) {
        threeRuntime.scene.background.dispose?.();
      }

      threeRuntime.scene.background = texture;
      threeRuntime.scene.environment = texture;
      onSceneChanged?.();
      setShowAddModel(false);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to load Photo Dome:", error);
      window.alert("Could not load this image.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!threeRuntime?.scene) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <p className="text-[1vw] min-[1920px]:text-[0.8vw] text-white">
          Loading 3D Scene ...
        </p>
      </div>
    );
  }

  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-col text-white">
      <div className="shrink-0 border-b border-gray-800 px-[0.8vw] py-[0.8vh]">
        <button
          type="button"
          onClick={() => setShowAddModel(true)}
          disabled={isAdding}
          className="flex h-[4vh] min-h-8 w-full items-center justify-center gap-[0.5vw] rounded-md py-[0.6vh] text-[1vw] min-[1920px]:text-[0.68vw] font-semibold text-[#34c5b7] transition hover:bg-[#34c5b7]/10 disabled:cursor-wait disabled:opacity-50"
        >
          <span className="text-[1.5vw] min-h-4 min-w-4 leading-none"><FaPlus size={15}/></span>
          {isAdding ? "Loading ..." : "Add 3D Element"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {rootObjects.length === 0 ? (
          <div className="px-[1vw] py-[3vh] text-center text-[1vw] min-[1920px]:text-[0.68vw] text-gray-500">
            No 3D Elements found
          </div>
        ) : (
          <div className="py-[1.3vh]">
            {rootObjects.map((object) => (
              <ObjectRow
                key={object.uuid}
                object={object}
                level={0}
                selectedObject={selectedObject}
                onSelect={setSelectedObject}
                expandedNodes={expandedNodes}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
        )}
      </div>

      {selectedObject && (
        <div className="shrink-0 border-t border-gray-800 px-[0.9vw] py-[1vh]">
          <div className="text-[0.8vw] font-semibold min-[1920px]:text-[0.6vw] uppercase tracking-wider text-gray-300">
            Selected Object
          </div>
          <div className="mt-[0.8vh] mb-[0.8vh] truncate text-[0.7vw] min-[1920px]:text-[0.65vw] font-medium text-[#34c5b7]">
            {getName(selectedObject)}
          </div>
          <div className="mt-[0.5vh] text-[0.6vw] min-[1920px]:text-[0.6vw] text-gray-300">
            {selectedObject.type}
          </div>
        </div>
      )}

      {showAddModel && (
        <Add3DElementModel
          onClose={() => !isAdding && setShowAddModel(false)}
          onAddAsset={addAsset}
          onAddText={addText}
          onAddPhotoDome={addPhotoDome}
          isAdding={isAdding}
        />
      )}
    </section>
  );
}
