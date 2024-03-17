"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import type { BusOverlay } from "@/type/busType";
import type { SetAtom } from "@/type/setAtom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAtom, type SetStateAction, useSetAtom } from "jotai";
import { FaTrash } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { overlayAtom, pageAtom, togglePolylineAtom } from "@/state/busState";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function Overlay({ city }: { city: string }) {
  const [busOverlay, setBusOverlay] = useAtom(overlayAtom);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full box-border border-b-[1px] border-white flex gap-1 pb-2 items-center h-fit min-h-0 justify-between">
        <span className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all">
          Overlay
        </span>
        <div className="flex h-full items-end py-1 text-sm text-gray-300 gap-2">
          <button className="transition-all hover:text-orange-200" onClick={()=>{
            setBusOverlay(prev => {
              const newArr = prev[city]?.map(d => {
                d.ShowOverlay = true
                return d
              })
              if (!newArr) {
                return {...prev}
              }
              prev[city] = newArr
              return {...prev}
            })
          }}>全部顯示</button>
          <p className="h-full border-r-[1px] border-gray-300 translate-y-[2px]"></p>
          <button className="transition-all hover:text-orange-200" onClick={()=>{
            setBusOverlay(prev => {
              const newArr = prev[city]?.map(d => {
                d.ShowOverlay = false
                return d
              })
              if (!newArr) {
                return {...prev}
              }
              prev[city] = newArr
              return {...prev}
            })
          }}>全部隱藏</button>
        </div>
      </div>
      <ScrollArea className="w-full h-full p-1">
        <div className="flex w-full flex-col gap-1">
          <OverlayList
            busOverlay={busOverlay}
            setBusOverlay={setBusOverlay}
            city={city}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

const OverlayList = ({
  busOverlay,
  setBusOverlay,
  city,
}: {
  busOverlay: { [key: string]: BusOverlay[] | undefined };
  setBusOverlay: SetAtom<
    [SetStateAction<{ [key: string]: BusOverlay[] | undefined }>],
    void
  >;
  city: string;
}) => {
  const setURLSearchParams = useSetURLSearchParams();
  const { toast } = useToast();
  const setTogglePolyline = useSetAtom(togglePolylineAtom);
  const setPage = useSetAtom(pageAtom);

  const handleRemove = (name: string, direction: number, headSign: string) => {
    setBusOverlay((prev) => {
      const filtered =
        prev[city]?.filter(
          (item) =>
            item.RouteName.Zh_tw !== name || item.Direction !== direction
        ) ?? [];
      prev[city] = filtered;
      return { ...prev };
    });
    toast({
      title: "刪除成功",
      description: `${name}（${headSign}）`,
      className: "bg-red-100",
    });
  };

  return (
    <>
      {busOverlay[city]?.map((item) => {
        const stopLength = item.Stops.length;
        const headSign = `${item.Stops[0].StopName.Zh_tw} - ${
          item.Stops[stopLength - 1].StopName.Zh_tw
        }`;

        return (
          <div
            key={`overlay ${item.RouteName.Zh_tw} ${item.Direction}`}
            className="flex w-full items-center gap-4"
          >
            <button
              onClick={() => {
                setTogglePolyline((prev) => ({
                  routeName: item.RouteName.Zh_tw,
                  direction: `${item.Direction}`,
                  id: prev.id + 1,
                }));
              }}
              className="relative group text-white p-1 text-left w-full"
            >
              <p>{item.RouteName.Zh_tw}</p>
              <p className="text-xs text-gray-300">{headSign}</p>
              <span
                className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
              ></span>
              <span
                className={`absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
              ></span>
            </button>
            <div className="box-border flex w-max items-center gap-2">
              <button
                onClick={() => {
                  handleRemove(item.RouteName.Zh_tw, item.Direction, headSign);
                }}
                className="bg-transparant h-fit  w-fit -translate-x-2 rounded border-2 border-red-700 p-1 text-center font-bold text-red-700 transition-all hover:bg-red-700 hover:text-white"
              >
                <FaTrash />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-transparant h-fit  w-fit -translate-x-2 rounded border-[1px] border-white p-1 text-center font-bold text-white transition-all hover:bg-white hover:text-black">
                    <FiMenu />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      //   setBus(item.RouteName.Zh_tw);
                      //   setDirection(`${item.Direction}`);
                      //   router.push(
                      //     `?bus=${item.RouteName.Zh_tw}&direction=${item.Direction}&station=${station}`
                      //   );
                      setPage("bus");
                      setURLSearchParams([
                        {
                          key: "bus",
                          value: item.RouteName.Zh_tw,
                        },
                        {
                          key: "direction",
                          value: `${item.Direction}`,
                        },
                        {
                          key: "page",
                          value: "bus",
                        },
                      ]);
                    }}
                  >
                    <span>查看公車</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Switch
                checked={item.ShowOverlay}
                className="-ml-2"
                onCheckedChange={(e) => {
                  setBusOverlay((prev) => {
                    const newArr = prev[city]?.map((d) => {
                      if (
                        d.RouteName.Zh_tw === item.RouteName.Zh_tw &&
                        d.Direction === item.Direction
                      ) {
                        d.ShowOverlay = e;
                        return d;
                      }
                      return d;
                    });
                    if (!newArr) {
                      return { ...prev };
                    }
                    prev[city] = newArr;
                    return { ...prev };
                  });
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
