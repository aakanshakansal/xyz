import {IoIosHelpCircle} from 'react-icons/io';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoChevronForwardSharp } from "react-icons/io5";
import { SHORTCUTS } from '../../../../data/shortcut';


import FloatingCard from "../../common/FloatingCard"
import { useState } from 'react';


export default function Help({ onClose }) {
    const [guidesOpen , setGuidesOpen] = useState(false)
    const [shorcutOpen, setShortcutOpen] = useState(false)
  return (
    <>
      <div
        className=" fixed inset-0 z-[90] bg-black/20
        "
      />

      <FloatingCard
        title="Help"
        width={700}
        initialPosition={{
          x: 120,
          y: 80,
        }}
        zIndex={100}
        icon={<IoIosHelpCircle size={20} />}
        onClose={onClose}
      >
        <div className="max-h-[75vh] overflow-y-auto py-4">
          <section className="overflow-hidden rounded-md bg-[#121212] p-3">
            <button
              type="button"
              onClick={() => setGuidesOpen((value) => !value)}
              className="flex h-8 w-full  items-center justify-between  text-left text-sm font-medium text-white transition p-2"
            >
              <span>Guides</span>
              <span>{guidesOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>

            {guidesOpen && (
              <div className="border-t border-neutral-800 p-3">
                <iframe
                  title="Badvisor 4.0 - Tutorials"
                  src="https://www.youtube.com/embed/videoseries?list=PLCt0SwPWx9zAjtZfULqJDbr_Dny2JEvCJ"
                  width="100%"
                  height="300"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </section>
          <section className="mt-2 overflow-hidden rounded-md bg-[#121212] p-3">
            <button
              type="button"
              onClick={() => setShortcutOpen((value) => !value)}
              className="flex h-8 w-full  items-center justify-between  text-left text-sm font-medium text-white transition p-2"
            >
              <span>Shortcuts</span>
              <span>{shorcutOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            {shorcutOpen && (
              <div className="border-t border-neutral-800 p-3">
                <div className="divide-y divide-neutral=800">
                  {SHORTCUTS.map((shortcut) => (
                    <div
                      key={shortcut.keys}
                      className="grid grid-cols-[180px_1fr]
                                    gap-x-10  gap-y-4 px-2 py-2.5 text-sm border-b border-gray-600"
                    >
                      <div>
                        <kbd className="inline-flex rounded border border-neutral-700 bg-[#292929] px-2 py-1 font-mono text-sm text-lime-300">
                          {shortcut.keys}
                        </kbd>
                      </div>
                      <div className="text-gray-300 font-medium">
                        {shortcut.description}
                      </div>
                    </div>
                  ))}{" "}
                </div>
              </div>
            )}
          </section>
          <button
            type="button"
            onClick={() => {
              window.open("https://badvisor.io/");
            }}
            className="mt-5 flex items-center gap-1 px-1  text-sm font-medium text-white transition "
          >
            <span>Documentation</span>
            <span>
              <IoChevronForwardSharp />
            </span>
          </button>
        </div>
      </FloatingCard>
    </>
  );
}