export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={5}
        // color="red"
      />

      <pointLight
        position={[-5, 2, 3]}
        intensity={1}
        // color="blue"
      />
      <spotLight
        position={[0, 5, 0]}    
    angle={0.3}
        intensity={1}
        // color="green"
      />

    </>
  )
}