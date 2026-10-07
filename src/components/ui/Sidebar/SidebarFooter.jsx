
import { FaPause } from "react-icons/fa6";
import {
  IoIosSave,
} from "react-icons/io";

import {
  MdGrid4X4,
  MdDesktopWindows,
  MdOutlineBlurCircular,
} from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import { exportScene } from "../../utils/sceneExporter";
import { useState } from "react";



export default function SidebarFooter({ onClose, threeRuntime }) {

  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format) =>{
    if(!threeRuntime?.scene || isExporting)
    {
      return;
    }
    setIsExporting(true);
    try{
      await exportScene({
        scene: threeRuntime.scene,
        format,
      });

    } catch(error)
    {
      console.error(`${format.toUpperCase()} export failed`, error)
    }
    finally{
      setIsExporting(false)
      setIsExportOpen(false)
    }
  }

  return (
    <div className="viewer-sidebar-surface flex  shrink-0 items-center justify-between gap-1 border-t border-gray-700 p-1  ">
      <FooterButton icon={FaArrowLeft} label="Exit" onClick={onClose} danger />
      <IconFooterButton icon={MdGrid4X4} />
      <IconFooterButton icon={MdDesktopWindows} />
      <IconFooterButton icon={MdOutlineBlurCircular} />
      <div className="relative shrink-0">
        {isExportOpen && (
          <div className="absolute bottom-15 right-0 z-50 flex min-w-[7.5vw] flex-col gap-[0.5vh] rounded-md border border-gray-600 bg-gray-900 p-1 shadow-xl">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport("glb")}
              className="flex items-center gap-[0.5vw] rounded px-[0.5vw] py-[0.5vh] text-left text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50"
            >
              <span>GLB </span>
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport("usdz")}
              className="flex items-center gap-[0.5vw] rounded px-[0.5vw] py-[0.5vh] text-left text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50"
            >
              <span>USDZ </span>
            </button>
          </div>
        )}
        <FooterButton
          icon={CiExport}
          label={isExporting ? "Exporting..." : "Export"}
          onClick={() => setIsExportOpen((open) => !open)}
          disabled={isExporting}
        />
      </div>

      <IconFooterButton icon={FaPause} />
      <FooterButton icon={IoIosSave} label="Save" onClick={onClose} danger />
    </div>
  );
}
function FooterButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`viewer-footer-button flex flex-row rounded-sm px-[0.7vw] py-[1vh]  text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${danger ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 text-white hover:bg-gray-600"}`}
    >
      <Icon size={18}   />
      <span className="viewer-footer-label ml-1">{label}</span>
    </button>
  );
}
function IconFooterButton({ icon: Icon, danger }) {
  return (
    <button
      className={`rounded-sm px-[0.7vw] py-[1vh]  focus:outline-none focus:ring-2 focus:ring-blue-500 ${danger ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 text-white hover:bg-gray-600"}`}
    >
      <Icon size={18} />
    </button>
  );
}