import {useState} from 'react'

const colorStyles = {
  cyan: {
    borderColor: "#34c5b7",
    color: "#34c5b7",
    socket: "#bada55",
  },
  purple: {
    borderColor: "#d90ffc",
    color: "#d90ffc",
    socket: "#ffffff",
  },
  yellow: {
    borderColor: "#ffeb3b",
    color: "#ffeb3b",
    socket: "#ffffff",
  },
  green: {
    borderColor: "#bada55",
    color: "#bada55",
    socket: "#ffffff",
  },
  red: {
    borderColor: "#f44336",
    color: "#f44336",
    socket: "#ffffff",
  },
  "sky-blue": {
    borderColor: "#64d4fc",
    color: "#64d4fc",
    socket: "#ffffff",
  },
  gray: {
    borderColor: "#9e9e9e",
    color: "#9e9e9e",
    socket: "#ffffff",
  },
  orange: {
    borderColor: "#ff9800",
    color: "#ff9800",
    socket: "#ffffff",
  },
  white: {
    borderColor: "#dae0db",
    color: "#dae0db",
    socket: "#ffffff",
  },
};

export default function ElementCard({
    title,
     icon: Icon, 
     color= "cyan", 
     onDoubleClick,
    onDragStart,
    }) {
    const [hovered, setHovered] = useState(false);
    const theme = colorStyles[color] || colorStyles.cyan;
  return (
    <div
      className="group relative w-full select-none "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      draggable
    >
      <div
        className="absolute left-0.5 top-0.5 h-full w-full rounded-sm border "
        style={{
          borderColor: theme.borderColor,
          backgroundColor: "#151515",
        }}
      />

      <div
        className="relative z-10 flex w-full h-full flex-col overflow-visible rounded-sm border-2 bg-[#34c5b7]  transition-all duration-150 "
        style={{
          backgroundColor: theme.color,
          borderColor: theme.borderColor,
          boxShadow: hovered
            ? `0 4px 12px rgba(0,0,0,0.45), inset 0 0 0 1px ${theme.border}`
            : ` 0 2px 5px rgba(0,0,0,0.35),`,
        }}
      >
        <div
          className="h-5 shrink-0 rounded-t-sm border-b"
          style={{
            backgroundColor: "#101010",
            borderColor: theme.borderColor,
          }}
        />

        <div className=" relative flex min-h-0 flex-1 flex-col items-center justify-center px-2">
          <p className="w-full text-center text-sm font-medium leading-tight text-black mt-2 ">
            {title}{" "}
          </p>

          <div className="mt-3 mb-2 flex items-center justify-center text-white ">
            <Icon size={25} strokeWidth={1.5} />
          </div>
        </div>
        <NodeSocket position="left" color={theme.socket} top="50%" />
        <NodeSocket position="right" color="#000" top="42%" />
        <NodeSocket position="right" color="#000" top="60%" />
        <NodeSocket position="right" color="#000" top="78%" />
      </div>
    </div>
  );
}
function NodeSocket({ position, color, top = "50%" }) {
  return (
    <span
      className="absolute z-30    -translate-y-1/2 rounded-full border border-black h-3 w-3"
      style={{
        top,
        backgroundColor: color,
        // border: borderColor,
        ...(position === "left"
          ? {
              left: "-6px",
            }
          : {
              right: "-6px",
            }),
      }}
    />
  );
}
