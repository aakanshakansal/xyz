import {
  FaPlus,
  FaCamera,
  FaSquareDribbble,
  FaPersonRunning,
  FaEquals,
} from "react-icons/fa6";
import {
  MdAddToPhotos,
  MdMovie,
  MdOutlineTextFields,
  MdSunny,
  MdAccessTimeFilled,
  MdOutlineStayCurrentLandscape,
} from "react-icons/md";
import { LuSquareCode, LuReplace } from "react-icons/lu";
import {
  TbDeviceRemoteFilled,
  TbTexture,
  TbRotate360,
  TbMathFunction,
  TbMathGreater,
  TbScanCube,
} from "react-icons/tb";
import { RiLightbulbFlashLine, RiAiGenerate3dFill } from "react-icons/ri";
import { PiSpeakerNoneThin, PiGlobeFill, PiSigmaBold } from "react-icons/pi";
import { BsGlobeAsiaAustralia, BsGlobe } from "react-icons/bs";
import { IoMdFlashlight, IoMdLink, IoIosSave } from "react-icons/io";
import { GiCube } from "react-icons/gi";
import { CiExport } from "react-icons/ci";

export const elementGroups = [
  {
    title: "3D Elements",
    items: [
      {
        id: "3D-asset",
        title: "3D Asset",
        icon: RiAiGenerate3dFill,
        color: "cyan",
      },
      {
        id: "3D-text",
        title: "3D Text",
        icon: MdOutlineTextFields,
        color: "cyan",
      },
      {
        id: "photo-dome",
        title: "Photo Dome",
        icon: BsGlobeAsiaAustralia,
        color: "cyan",
      },
    ],
  },
  {
    title: "Cameras",
    items: [
      {
        id: "orbit-camera",
        title: "Orbit Camera ",
        icon: TbRotate360,
        color: "purple",
      },
      {
        id: "first-Person-camera",
        title: "First Person Camera ",
        icon: FaCamera,
        color: "purple",
      },
    ],
  },
  {
    title: "Lights",
    items: [
      {
        id: "point-light",
        title: "Point light ",
        icon: RiLightbulbFlashLine,
        color: "yellow",
      },
      {
        id: "directional-light",
        title: "Directional light ",
        icon: MdSunny,
        color: "yellow",
      },
      {
        id: "hemspherical-light",
        title: "Hemspherical light ",
        icon: IoMdFlashlight,
        color: "yellow",
      },
      {
        id: "spot-light",
        title: "Spot light ",
        icon: BsGlobe,
        color: "yellow",
      },
    ],
  },
  {
    title: "Materials",
    items: [
      {
        id: "PBR-material",
        title: "PBR Material ",
        icon: RiAiGenerate3dFill,
        color: "yellow",
      },
      {
        id: "shadow-material",
        title: "Shadow Only Material",
        icon: PiGlobeFill,
        color: "yellow",
      },
      {
        id: "transmission-material",
        title: "Transmission Material ",
        icon: FaSquareDribbble,
        color: "yellow",
      },
    ],
  },
  {
    title: "Textures",
    items: [
      {
        id: "Texture",
        title: "Texture ",
        icon: TbTexture,
        color: "orange",
      },
      {
        id: "cube-Texture",
        title: "Cube Texture ",
        icon: GiCube,
        color: "orange",
      },
      {
        id: "HDR-cube-Texture",
        title: "HDRCube Texture ",
        icon: GiCube,
        color: "orange",
      },
      {
        id: "video-Texture",
        title: "Video Texture ",
        icon: MdMovie,
        color: "orange",
      },
      {
        id: "dynamic-Texture",
        title: "Dynamic Texture ",
        icon: MdOutlineTextFields,
        color: "orange",
      },
      {
        id: "color-Texture",
        title: "Color Grading Texture ",
        icon: TbTexture,
        color: "orange",
      },
    ],
  },
  {
    title: "Overlays",
    
    items: 
    [
        {
      id: "overlay",
      title: "Overlay",
      icon: MdOutlineStayCurrentLandscape,
      color: "white",
    },
]
    
  },
  {
    title: "Actions",
    items: [
      {
        id: "animate",
        title: "Animate",
        icon: FaPersonRunning,
        color: "red",
      },
      {
        id: "condition",
        title: "Condition",
        icon: FaEquals,
        color: "red",
      },
      {
        id: "timeline",
        title: "Timeline",
        icon: MdAccessTimeFilled,
        color: "red",
      },
      {
        id: "math",
        title: "Math",
        icon: PiSigmaBold,
        color: "red",
      },
      {
        id: "expression",
        title: "Expression",
        icon: TbMathFunction,
        color: "red",
      },
      {
        id: "sequencer",
        title: "Sequencer",
        icon: TbMathGreater,
        color: "red",
      },
      {
        id: "overlays",
        title: "Overlays",
        icon: MdOutlineStayCurrentLandscape,
        color: "red",
      },
      {
        id: "enter-AR",
        title: "Enter-AR",
        icon: TbScanCube,
        color: "red",
      },
      {
        id: "enter-VTO",
        title: "Enter-VTO",
        icon: FaPlus,
        color: "red",
      },
      {
        id: "external-links",
        title: "External Links",
        icon: IoMdLink,
        color: "red",
      },
      {
        id: "add-replace",
        title: "AddReplace",
        icon: LuReplace,
        color: "red",
      },
      {
        id: "save-config",
        title: "SaveConfig",
        icon: IoIosSave,
        color: "red",
      },
      {
        id: "screenshot",
        title: "Screenshot",
        icon: MdOutlineStayCurrentLandscape,
        color: "red",
      },
      {
        id: "export-scene",
        title: "Export Scene",
        icon: CiExport,
        color: "red",
      },
    ],
  },
  {
    title: "Sounds",
    items: [
        {

      id: "sound",
      title: "Sound",
      icon: PiSpeakerNoneThin,
      color: "sky-blue",
    },
]
  },
  {
    title: "Utilities",
    items: [
      {
        id: "variable",
        title: "Variable",
        icon: LuSquareCode,
        color: "gray",
      },
      {
        id: "collection",
        title: "Collection",
        icon: MdAddToPhotos,
        color: "gray",
      },
      {
        id: "control-node",
        title: "Control Node",
        icon: TbDeviceRemoteFilled,
        color: "gray",
      },
    ],
  },
];
