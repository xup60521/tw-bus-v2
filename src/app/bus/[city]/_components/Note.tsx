"use client";

import { noteAtom } from "@/state/busState";
import { useAtom } from "jotai";
import { FaTrash } from "react-icons/fa";

const NoteCard: React.FC = () => {
  const [note, setNote] = useAtom(noteAtom);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full box-border border-b-[1px] border-white flex gap-1 pb-2 items-center h-fit min-h-0">
        <span className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all">
          Note
        </span>
      </div>
      <textarea
        className="w-full h-full p-4 resize-none text-black rounded-md mt-2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        onClick={() => {
          if (confirm("Delete Note?")) {
            setNote("");
          }
        }}
        className="absolute hover:scale-125 z-10 transition-all right-6 bottom-6 flex items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default NoteCard;
