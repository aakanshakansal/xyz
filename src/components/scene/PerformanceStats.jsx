import { useFrame, useThree } from "@react-three/fiber"
import {  useRef } from "react"

export default function PerformanceStats ({onUpdate}) {
    const {gl } = useThree()
    const elapsedRef = useRef(0)
    const frameRef = useRef(0)
    
    useFrame((state, delta)=>{
        frameRef.current += 1;
        elapsedRef.current += delta
       
        if(elapsedRef.current >= 0.5 )
        {
            const fps =frameRef.current/ elapsedRef.current ;
           
               const  drawCalls = gl.info.render.calls;
              const triangles = gl.info.render.triangles;
        onUpdate?.({
            fps: Math.round(fps),
            drawCalls,
            triangles,
        })
        frameRef.current=0
        elapsedRef.current=0
        gl.info.reset();
        }
    })
    
    return null; 


}