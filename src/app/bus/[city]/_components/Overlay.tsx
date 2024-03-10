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
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, useSearchParams } from "next/navigation";
import { overlayAtom, togglePolylineAtom } from "@/state/busState";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";

export default function Overlay() {
  const [busOverlay, setBusOverlay] = useAtom(overlayAtom);
  const searchParams = useSearchParams();
  const station = searchParams.get("station") ?? "";

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full box-border border-b-[1px] border-white flex gap-1 pb-2 items-center h-fit min-h-0">
        <span className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all">
          Overlay
        </span>
      </div>
      <ScrollArea className="w-full h-full p-1">
        <div className="flex w-full flex-col gap-1">
          <OverlayList
            busOverlay={busOverlay}
            setBusOverlay={setBusOverlay}
            station={station}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

const OverlayList = ({
  busOverlay,
  setBusOverlay,
  station,
}: {
  busOverlay: BusOverlay[];
  setBusOverlay: SetAtom<[SetStateAction<BusOverlay[]>], void>;
  station: string;
}) => {
  const setURLSearchParams = useSetURLSearchParams();
  const { toast } = useToast();
  const setTogglePolyline = useSetAtom(togglePolylineAtom);

  const handleRemove = (name: string, direction: number, headSign: string) => {
    setBusOverlay((prev) => {
      const filtered = prev.filter(
        (item) => item.RouteName.Zh_tw !== name || item.Direction !== direction
      );
      return [...filtered];
    });
    toast({
      title: "刪除成功",
      description: headSign,
      className: "bg-red-100",
    });
  };

  return (
    <>
      {busOverlay.map((item) => {
        const stopLength = item.Stops.length;
        const headSign = `${item.RouteName.Zh_tw}（${
          item.Stops[0].StopName.Zh_tw
        } - ${item.Stops[stopLength - 1].StopName.Zh_tw}）`;

        return (
          <div
            key={`overlay ${item.RouteName.Zh_tw} ${item.Direction}`}
            className="flex w-full items-center justify-between"
          >
            <button
              onClick={() => {
                setTogglePolyline((prev) => ({
                  routeName: item.RouteName.Zh_tw,
                  direction: `${item.Direction}`,
                  id: prev.id + 1,
                }));
              }}
              className="relative group text-white p-1"
            >
              <span>{headSign}</span>
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
            </div>
          </div>
        );
      })}
    </>
  );
};
