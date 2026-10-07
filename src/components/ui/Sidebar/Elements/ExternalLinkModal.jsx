import { useEffect, useState } from "react";
import FloatingCard from "../../common/FloatingCard"
import { Toggle, SettingsSection, SettingsRow } from "../../common/SettingsControls";

import { IoMdLink } from "react-icons/io";
 const Default_Link={
  tab :{
    enabled:false,
  },
  notes: "",
 }
 const Ext_link = Default_Link.tab

export default function ExternalLinkModal ({onClose, onConfirm})  {

  const [name , setName] = useState("")
  const [url, setUrl] = useState("")
  const [error,setError] = useState("")
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(()=>{
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () =>{
      document.body.style.overflow = previousOverflow;
    }
  },[]);

  const handleSubmit = (event)=>{
    event.preventDefault();

    setError("");
    const cleanUrl = url.trim()

    if(!cleanUrl){
      setError("Please Enter a URL.");
      return;
    }

    let parsedUrl;

    try{
      parsedUrl = new URL(cleanUrl);

    }catch {
      setError("Please enter a valid URL.");
      return;
    }

    if(parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")
    {
      setError("Only HTTP and HTTPS URLs are allowed.");
      return;
    }

    onConfirm?.({
      type: "External Link",
      url:parsedUrl.toString(),
    
    })
  }

  return (
    <FloatingCard
      title="External Link"
      icon={<IoMdLink size={15} />}
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
              value={Default_Link.name}
              onChange={(event)=>{setName(event.target.value);
                setError("");
              }}
              className="w-40 bg-transparent text-right outline-none"
              placeholder="Enter name"
            />
          </div>
        </div>

        <SettingsRow label="Open in New Tab">
          <Toggle checked={Ext_link.enabled} />
        </SettingsRow>
        <div className="flex h-10 w-full items-center justify-between rounded bg-[#555555] px-2 text-sm text-white">
          <span>Link</span>

          <div className="flex items-center gap-2">
            <input
              type="text"
              onChange={(event) => {
                setUrl(event.target.value);
                setError("");
              }}
              value={url}
              className="w-40 bg-transparent text-right outline-none"
              placeholder="Enter URL"
            />
          </div>
        </div>

        <SettingsSection
          name="Notes"
          open={notesOpen}
          onClick={() => setNotesOpen((value) => !value)}
        >
          <textarea
            value={Default_Link.notes}
            placeholder="Enter Notes"
            className="h-40 w-full rounded bg-[#242323] px-2 py-1 text-sm font-semibold text-white resize-none"
          />
        </SettingsSection>
        {error && (
          <div className="rounded-md border border-red-400 bg-amber-600 px-3 py-2 text-sm text-white">
            {error}
          </div>
        )}
        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            Create Action
          </button>
        </div>
      </div>
    </FloatingCard>
  );
}
