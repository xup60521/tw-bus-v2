"use client";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import ReactQuery from "./_components/ReactQueryClient";
import type { BusList } from "@/type/busType";
import { getAllBus } from "@/server_action/getAllBus";
import { useSetAtom } from "jotai";
import { showCityOverlayAtom, showCityRailwayOverlayAtom } from "@/state/busState";
// import { DevTools } from 'jotai-devtools'

export const runtime = 'edge';

const Map = dynamic(() => import("./_components/Map"), { ssr: false });
const Nav = dynamic(()=>import("./_components/Nav"), {ssr: false})
export default function City({ params }: { params: { city: string } }) {
  const { city } = params;
  const [openNav, setOpenNav] = useState(false);
  const [initBusList, setInitBusList] = useState<BusList[]>([]);
  const setShowCityOverlay = useSetAtom(showCityOverlayAtom)
  const setShowCityRailwayOverlay = useSetAtom(showCityRailwayOverlayAtom)
  useEffect(() => {
    getAllBus(city).then((res: BusList[]) => {
      setInitBusList([...res]);
    });
    setOpenNav(true)
    setShowCityOverlay([city])
    if (["Taipei", "NewTaipei"].includes(city)) {
        setShowCityRailwayOverlay(["tp", "ty"])
    }
    if (city === "Taoyuan") {
        setShowCityRailwayOverlay(["ty"])
    }
    if (["Taichung","ChanghuaCounty"].includes(city)) {
        setShowCityRailwayOverlay(["tc"])
    }
    if (city === "Kaohsiung") {
        setShowCityRailwayOverlay(["ks"])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactQuery>
      {/* <DevTools /> */}
      <main className="w-screen h-screen flex md:flex-row relative flex-col gap-2 min-h-0 min-w-0 bg-slate-800 text-white md:p-2">
        <div className="md:h-full flex-grow md:rounded-md overflow-hidden bg-blue-800">
          <Map />
        </div>
        <button onClick={()=>setOpenNav(!openNav)} className="absolute left-4 md:block hidden bottom-4 rounded-full bg-gray-300 opacity-50 text-black transition-all hover:scale-125 p-2 px-4 text-md hover:opacity-100">{openNav ? "X" : "V"}</button>
        
          <>
            <div className={`md:h-full md:w-[25rem] h-[45vh] ${openNav ? "" : "md:hidden"}`}>
              <Nav city={city} initBusList={initBusList} />
            </div>
          </>
        
      </main>
      <Toaster />
    </ReactQuery>
  );
}
