import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function FloatingCard({
    title,
    icon,
    children,
    onClose,
    width= 350,
    initialPosition ={x: 100, y:100},
    zIndex= 100,
    className= "",


}) {

    const cardRef= useRef(null);
    const dragRef = useRef({
      active: false,
      offsetX: 0,
      offsetY: 0,
    });
    const [position, setPosition] = useState(initialPosition);

    const clampPosition = useCallback(()=>{
        const card = cardRef.current;
        if (!card) return;
        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const maxX = Math.max(8, window.innerWidth - width - 8);
        const maxY = Math.max(8, window.innerHeight - height - 8);

        setPosition((current)=>({
            x: Math.min(Math.max(8, current.x),maxX),
            y: Math.min(Math.max(8, current.y),maxY)
        }))

    },[]);

    const handlePointerDown = useCallback((event) => {
        const card = cardRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();

      dragRef.current = {
        active: true,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };

      event.currentTarget.setPointerCapture?.(event.pointerId);
    }, []);

      const handlePointerMove = useCallback((event) => {
        if (!dragRef.current.active) return;

        const card = cardRef.current;
        if (!card) return;
        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const maxX = Math.max(8, window.innerWidth - width - 8);
        const maxY = Math.max(8, window.innerHeight - height - 8);

        const nextX = Math.max(
          8,
          Math.min(maxX, event.clientX - dragRef.current.offsetX),
        );

        const nextY = Math.max(
          8,
          Math.min(maxY, event.clientY - dragRef.current.offsetY),
        );

        setPosition({
          x: nextX,
          y: nextY,
        });
      }, []);

        const handlePointerUp = useCallback((event) => {
          dragRef.current.active = false;
          event.currentTarget.releasePointerCapture?.(event.pointerId);
        }, []);


         useEffect(() => {
           
           clampPosition();
           window.addEventListener("resize", clampPosition);
           return () => {
             window.removeEventListener("resize", clampPosition);
           };
         }, [clampPosition]);


         return (
           <div
             ref={cardRef}
             className={`fixed p-4 overflow-hidden rounded-sm border border-neutral-700 bg-[#181818] text-white shadow-2xl select-none ${className}`}
             style={{
               width: `min(${width}px, calc(100vw - 2vw))`,
               maxWidth: "calc(100vw - 2vw)",
               left: `${position.x}px`,
               top: `${position.y}px`,
               zIndex,
             }}
           >
             {/* header */}
             <div
               className="flex h-10 cursor-move items-center justify-between  touch-none border border-neutral-700 bg-[#181818] px-2"
               onPointerDown={handlePointerDown}
               onPointerMove={handlePointerMove}
               onPointerUp={handlePointerUp}
               onPointerCancel={handlePointerUp}
             >
               <div className="flex items-center gap-2">
                 {icon && <span className="text-sm">{icon}</span>}
                 <span className="text-sm font-semibold">{title}</span>
               </div>
               {onClose && (
                 <button
                   type="button"
                   aria-label={`Close ${title}`}
                   onClick={onClose}
                   onPointerDown={(event) => {
                     event.stopPropagation();
                   }}
                   className="flex h-8 w-8   items-center justify-center rounded-md  text-sm leading-none text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
                 >
                   <IoMdClose />
                 </button>
               )}
             </div>
             <div>{children}</div>
           </div>
         );
}
