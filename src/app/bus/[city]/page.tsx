import { unstable_noStore } from "next/cache";
import dynamic from "next/dynamic";
import Link from "next/link";
import Nav from "./_components/Nav";
import { getAllBus } from "@/server_action/getAllBus";
import { Toaster } from "@/components/ui/toaster";

const Map = dynamic(() => import("./_components/Map"), { ssr: false });
// const Nav = dynamic(()=>import("./_components/Nav"))
export default async function City({ params }: { params: { city: string } }) {
  unstable_noStore();
  const { city } = params;
  
  return (
    <main className="w-screen h-screen flex md:flex-row flex-col gap-2 min-h-0 min-w-0 bg-slate-800 text-white p-2">
      <div className="md:h-full flex-grow rounded-md overflow-hidden bg-slate-800">
        <Map city={city} />
      </div>
      <div className="md:h-full md:w-[25rem] h-[50vh]">
        {/* {JSON.stringify(initBusList)} */}
        <Nav city={city} />
      </div>
      <Toaster />
    </main>
  );
}
