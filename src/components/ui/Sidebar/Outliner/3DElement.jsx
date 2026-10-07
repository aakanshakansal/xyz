import { BsDiamond, BsFillDiamondFill } from "react-icons/bs";
import {
  FaChevronDown,
  FaChevronUp,
  FaEye,
} from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";

 function isEditorHelper(object) {
  return (
    object?.userData?.isEditorHelper === true ||
    object?.userData?.badvisorIgnorePicking === true
  );
}

 function is3DSceneObject(object) {
  if (!object) {
    return false;
  }
  if (object.isCamera) {
    return false;
  }

  if (object.isLight) {
    return false;
  }
  if (object.isAudio || object.isPositionalAudio) {
    return false;
  }

  if (isEditorHelper(object)) {
    return false;
  }

  return Boolean(object.isObject3D);
}

 function getObjectLabel(object) {
  return (
    object?.userData?.displayName ||
    object?.name ||
    object?.userData?.name ||
    "object"
  );
}

export function get3DElementRoots(scene) {
  if (!scene) {
    return [];
  }

  return scene.children.filter(is3DSceneObject);
}

export function get3Dchildren(object) {
  if (!object?.children?.length) {
    return [];
  }

  return object.children.filter((child) => {
    if (!child) {
      return false;
    }

    if (isEditorHelper(child)) {
      return false;
    }

    if (child.isCamera) {
      return false;
    }

    if (child.isLight) {
      return false;
    }

    if (child.isAudio || child.isPositionalAudio) {
      return false;
    }

    return Boolean(child.isObject3D);
  });
}

export function SceneTreeNode({
  object,
  depth = 0,
  expandedNodes,
  selectedObject,
  onToggle,
  onSelect,
  onToggleVisibility,
}) {
  const children = get3Dchildren(object);

  const hasChildren = children.length > 0;

  const isExpanded = expandedNodes.has(object.uuid);

  const isSelected = selectedObject?.uuid === object.uuid;

  const isVisible = object.visible !== false;

  return (
    <div className="w-full">
      <div
        className={[
          " group flex w-full items-center ",
          "min-h-[32px] rounded-sm",
          "pr-2 transition-colors",
          isSelected
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800",
        ].join(" ")}
        style={{
          paddingLeft: `${10 + depth * 18}px`,
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            if (hasChildren) {
              onToggle(object.uuid);
            }
          }}
          className={[
            "flex h-6 w-5 shrink-0",
            "items-center justify-center",
            hasChildren
              ? "cursor-pointer text-gray-400 hover:text-white"
              : "cursor-default text-transparent",
          ].join(" ")}
          aria-label={
            hasChildren
              ? isExpanded
                ? "collapse object"
                : "Expand object"
              : undefined
          }
        >
          {hasChildren &&
            (isExpanded ? (
              <FaChevronDown size={9} />
            ) : (
              <FaChevronUp size={9} />
            ))}
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleVisibility(object);
          }}
          className={[
            "mr-2 flex h-6 w-6 shrink -0",
            "items-center justify-center",
            "text-gray-400",
            "hover:text-white",
          ].join(" ")}
          title={isVisible ? "Hide object" : "Show object"}
          aria-label={isVisible ? "Hide object" : "Show object"}
        >
          {isVisible ? <FaEye size={9} /> : <FiEyeOff size={9} />}
        </button>
        <span
          className={[
            "mr-2 flex h-6 w-5 shrink-0 ",
            "items-center justify-center",
            "text-xs",
            "text-gray-400",
          ].join(" ")}
        >
          {object.isGroup ? (
            <BsDiamond size={9} />
          ) : (
            <BsFillDiamondFill size={9} />
          )}
        </span>

        <button
          type="button"
          onClick={() => onSelect(object)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm">
            {getObjectLabel(object)}
          </span>
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <SceneTreeNode
              key={child.uuid}
              object={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              selectedObject={selectedObject}
              onToggle={onToggle}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function objectMatchesSearch(object, search) {
  if (!search) {
    return true;
  }

  const label = getObjectLabel(object).toLowerCase();

  if (label.includes(search)) {
    return true;
  }

  return get3Dchildren(object).some((child) =>
    objectMatchesSearch(child, search),
  );
}
