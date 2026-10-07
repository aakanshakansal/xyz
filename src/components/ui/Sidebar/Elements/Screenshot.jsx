

export default function  Screenshot ({canvas}) {
    // const capture = ()=>{
        if ( !canvas)
        {
            console.warn("Screenshot of canvas not available")
            return ;
        }
        try {
            canvas.toBlob((blob)=>{
                if(!blob){
                    console.warn("Screenshot failedto create image ");
                    return;

                }
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a");
                link.href = url;
                link.download = `badvisor-screenshot-${Date.now()}.png`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

            },
            "image/png"
        )

            
            

        }
        catch (error)
        {
            console.error("Screenshot failed" , error )
        }
    
}
