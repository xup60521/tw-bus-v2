"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { RNN } from "@/lib/utils";
import type { BusList } from "@/type/busType";
import { SetAtom } from "@/type/setAtom";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { route_busAtom, route_directionAtom } from "@/state/routeState";
import { getAllBus } from "@/server_action/getAllBus";

export const runtime = 'edge';

const Map = dynamic(() => import("./_components/Map"), { ssr: false });
export default function Page({ params }: { params: { city: string } }) {
  const { city } = params;
  const [open, setOpen] = useState(false);
  const [bus, setBus] = useAtom(route_busAtom)
  const setDirection = useSetAtom(route_directionAtom);
  const [initBusList, setInitBusList] = useState<BusList[]>([]);

  useEffect(() => {
    getAllBus(city)
      .then((res) => setInitBusList([...res]))
      .catch((err) => alert(err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main className="w-scsreen h-screen overflow-hidden bg-slate-700 flex flex-col min-h-0 min-w-0 p-2 gap-2">
        <div className="w-full flex-grow border-2 rounded-lg">
          <Map />
        </div>
        <nav className="w-full h-fit flex">
          <Button onClick={()=>setOpen(true)} className="text-white bg-transparent hover:bg-white hover:text-black border-white border-[1px]">
            {bus ? bus : "選擇公車"}
          </Button>
        </nav>
      </main>
      <DrawerSection
        open={open}
        setOpen={setOpen}
        setBus={setBus}
        setDirection={setDirection}
        initBusList={initBusList}
      />
    </>
  );
}

const DrawerSection = ({
  open,
  setOpen,
  initBusList,
  setBus,
  setDirection,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initBusList: BusList[];
  setBus: SetAtom<[React.SetStateAction<string>], void>;
  setDirection: SetAtom<[React.SetStateAction<string>], void>;
}) => {
  const [qString, setQString] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const data = structuredClone(initBusList)
    .sort(
      (a, b) => Number(RNN(a.RouteName.Zh_tw)) - Number(RNN(b.RouteName.Zh_tw))
    )
    .map((item) => {
      const headSign = `${item.RouteName.Zh_tw} ${
        item.SubRoutes[0].Headsign ?? ""
      }`;
      return {
        headSign,
        ...item,
      };
    })
    .filter((item) => {
      if (qString) {
        return item.headSign.includes(qString);
      }
      return true;
    });
  return (
    <>
      <Drawer onClose={() => setOpen(false)} open={open}>
        <DrawerContent
          onInteractOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <DrawerHeader>
            <DrawerTitle asChild>選擇公車</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter className="flex flex-col items-center">
            <Input
              ref={inputRef}
              value={qString}
              onChange={(e) => {
                setQString(e.target.value);
              }}
              placeholder="搜尋路線..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputRef.current?.blur();
                }
              }}
            />
            <ScrollArea className="h-[60vh] w-full">
              <div className="w-full flex flex-col">
                {data.map((item, index) => {
                  return (
                    <Fragment
                      key={`fragment ${item.SubRoutes[0].SubRouteName.Zh_tw}`}
                    >
                      {index !== 0 && (
                        <div className="w-full border-t-[0.05rem] border-slate-100 mx-1" />
                      )}
                      <div
                        onClick={() => {
                          closeBtnRef.current?.click();
                          setQString("");
                          setDirection("0");
                          setBus(item.RouteName.Zh_tw);
                        }}
                        className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                      >
                        {item.headSign}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </ScrollArea>

            <Button
              variant="outline"
              ref={closeBtnRef}
              onClick={() => setOpen(false)}
              className="w-fit"
            >
              取消
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
