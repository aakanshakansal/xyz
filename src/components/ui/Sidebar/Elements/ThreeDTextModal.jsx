import {  useEffect, useState } from "react";
import FloatingCard from "../../common/FloatingCard";

const Default_Text = "Badvisor";
const Default_Font = "Helvetiker Regular";
const Default_Resolution = 16;

export default function ThreeDTextModal({ onClose, onConfirm }) {
 

  const [text, setText] = useState(Default_Text);
  const [font, setFont] = useState(Default_Font);
  const [resolution, setResolution] = useState(Default_Resolution);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleConfirm = () => {
    const cleanText = text.trim() || Default_Text;
    onConfirm?.({
      text: cleanText,
      font,
      resolution: Number(resolution),
    });
  };
  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/20 "
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose?.();
          }
        }}
      />
     
      <FloatingCard
      title="3D Text"
      onClose={onClose} 
      width={420}
      initialPosition={{
        x:0,
        y:0,
      }}
      zIndex={100}
      >
         

        <div className="space-y-4  py-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-200">
              Text
            </label>
            <input
              type="text"
              value={text}
              placeholder="Enter Text "
              onChange={(event) => setText(event.target.value)}
              className="h-9 w-full rounded-md border border-gray-800 bg-[#212121] px-3 text-sm text-white outline-none"
            />
          </div>
        
        {/* font */}

        <div>
          <label className="py-3 block text-sm font-medium text-gray-200">
            Font
          </label>
          <select
            value={font}
            onChange={(event) => setFont(event.target.value)}
            className="h-9 w-full rounded-md border border-gray-700 bg-[#242424] px-3 text-sm text-white outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          >
            <option>FigTree Medium</option>
          </select>
        </div>
        {/* Resolution */}
        <div>
          <div className="py-3 flex items-center justify-between">
            <label className=" text-sm font-medium text-gray-200">
              Resolution
            </label>
            <span className="test-sm text-gray-400">{resolution}</span>
          </div>
          <input
            type="range"
            min={4}
            max={100}
            step={1}
            value={resolution}
            onChange={(event) => setResolution(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none  rounded-sm bg-gray-600 accent-lime-400"
          />
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>4</span>
            <span>100</span>
          </div>
        </div>
        </div>
        
        {/* button cancel and confirm  */}
        <div className="flex items-center justify-between gap-5 mt-3  px-2 py-1">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-gray-700 bg-[#242424] px-4 text-sm font-medium text-gray-300 transition hover:bg-[#303030] hover:text-white"
          >
            {" "}
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-8 rounded-md border border-gray-700 bg-lime-400 px-4 text-sm font-semibold text-black transition hover:bg-lime-300 "
          >
            Confirm
          </button>
        </div>
      
      </FloatingCard>
    </>
  );
}