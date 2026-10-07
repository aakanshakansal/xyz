import { useState } from "react";
import FloatingCard from "../../common/FloatingCard";
import { MdOutlineStayCurrentLandscape } from "react-icons/md";

export default function Overlay( onClose, ){
    const [name ,setName] = useState("")
    return (
      <FloatingCard
        title="Overlay"
        icon={<MdOutlineStayCurrentLandscape size={15} />}
        width={350}
        initialPosition={{
          x: 20,
          y: 100,
        }}
        onClose={onClose}
      >
        <div className="space-y-1 py-2">
        <div className="flex h-10 w-full items-center justify-between rounded bg-[#555555] px-2 text-sm text-white">
          <span>Name</span>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value=""
              onChange={(event)=>{setName(event.target.value);
              }}
              className="w-40 bg-transparent text-right outline-none"
              placeholder="Enter name"
            />
          </div>
          
          </div>
          </div>
      </FloatingCard>
    );
}