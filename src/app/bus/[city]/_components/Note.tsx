"use client";

import { noteAtom } from "@/state/busState";
import { useAtom } from "jotai";
import { FaTrash } from "react-icons/fa";

const NoteCard: React.FC = () => {
  const [note, setNote] = useAtom(noteAtom);

  return (
    <div className="w-full h-full rounded-lg md:opacity-90 bg-white text-black flex flex-col items-center pb-1 gap-1">
      <h1 className="h-8 w-full p-1 text-center bg-slate-700 text-white font-bold md:rounded-t-lg">
        筆記
      </h1>
      <textarea
        className="w-full h-full p-4 resize-none"
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
