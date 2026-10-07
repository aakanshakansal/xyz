import {FaPlus, FaCamera} from 'react-icons/fa6';
import { FaCog } from "react-icons/fa";
import { IoIosHelpCircle} from 'react-icons/io';
import {MdAddToPhotos, MdMovie} from 'react-icons/md';
import {LuSquareCode} from 'react-icons/lu';
import {TbDeviceRemoteFilled, TbTexture} from 'react-icons/tb';
import {RiLightbulbFlashLine, RiAiGenerate3dFill} from 'react-icons/ri';
import {PiSpeakerNoneThin} from 'react-icons/pi';
import {MdOutlineStayCurrentLandscape} from 'react-icons/md';



export const OutlinerItems = [
  {id: 'help', label: 'Help', icon: IoIosHelpCircle},
  {
  id: 'settings',
  label: 'Settings',
  icon: FaCog,
  expandable: true,
  children: [
    { id: 'engine-settings', label: 'Engine Settings' },
    { id: 'scene-settings', label: 'Scene Settings' },
    { id: 'effects', label: 'Effects' },
  ],
},

  {id: 'capture', label: 'Capture', icon: MdMovie},
  {id: 'collections', label: 'Collections', icon: MdAddToPhotos},
  {id: 'control-nodes', label: 'Control Nodes', icon: TbDeviceRemoteFilled},
  {id: 'cameras', label: 'Cameras', icon: FaCamera, expandable: true},
  {
    id: 'lights',
    label: 'Lights',
    icon: RiLightbulbFlashLine,
    expandable: true,
  },
  {
    id: '3d-elements',
    label: '3D Elements',
    icon: RiAiGenerate3dFill,
    expandable: true,
  },
  {id: 'materials', label: 'Materials', icon: FaPlus, expandable: true},
  {id: 'textures', label: 'Textures', icon: TbTexture, expandable: true},
  {id: 'actions', label: 'Actions', icon: MdMovie, expandable: true},
  {id: 'variables', label: 'Variables', icon: LuSquareCode},
  {id: 'sounds', label: 'Sounds', icon: PiSpeakerNoneThin},
  {
    id: 'overlays',
    label: 'Overlays',
    icon: MdOutlineStayCurrentLandscape,
    expandable: true,
  },
];
