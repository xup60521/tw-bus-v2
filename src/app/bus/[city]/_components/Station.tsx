"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchStop } from "@/server_action/searchStop";
import { overlayAtom, pageAtom } from "@/state/busState";
import type { BusRoutePassBy, BusStopSearchResult } from "@/type/busType";
import { useAtomValue, useSetAtom } from "jotai";
import Popup from "reactjs-popup";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RNN } from "@/lib/utils";
import { FiMenu } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getRoutePassBy } from "@/server_action/getRoutePassby";
import { useOverlay } from "@/hooks/useOverlay";
import { useSearchParams } from "next/navigation";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import RemainningTime from "./RemainningTime";
import dynamic from "next/dynamic";

const PopupInfo = dynamic(() => import("./PopupInfo"), { ssr: false });
export default function Station({ city }: { city: string }) {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const station = searchParams.get("station") ?? "";
    const direction = searchParams.get("direction") ?? "";
    const bus = searchParams.get("bus") ?? "";
    const data = useQuery({
        queryKey: ["routePassBy"],
        queryFn: () => getRoutePassBy(city, station),
        enabled: !!station,
        refetchInterval: 15000,
    });
    const [openInfo, setOpenInfo] = useState(false);
    const [currentBus, setCurrentBus] = useState("");

    useEffect(() => {
        data.refetch();
    }, [station]);

    return (
        <>
            <div className="w-full h-full flex flex-col min-h-0">
                <div className="w-full flex gap-1 items-start pb-2 h-fit min-h-0">
                    <button
                        onClick={() => setOpen(true)}
                        className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all hover:bg-white hover:text-black "
                    >
                        {station ? station : "選擇站牌..."}
                    </button>
                </div>
                <div className="w-full border-t-[1px] border-white"></div>
                <ScrollArea className="w-full h-full">
                    <div className="flex w-full flex-col gap-1 p-1">
                        <BusList
                            city={city}
                            bus={bus}
                            direction={direction}
                            list={data.data}
                            setOpenInfo={setOpenInfo}
                            setCurrentBus={setCurrentBus}
                        />
                    </div>
                </ScrollArea>
            </div>
            <PopupInfo
                city={city}
                openPopup={openInfo}
                setOpenPopup={setOpenInfo}
                bus={currentBus}
            />
            <PopupSetStation city={city} setOpen={setOpen} open={open} />
        </>
    );
}

function PopupSetStation({
    open,
    setOpen,
    city,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    city: string;
}) {
    const [result, setResult] = useState<BusStopSearchResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const setURLSearchParams = useSetURLSearchParams();
    const handleSearch = async () => {
        if (inputRef.current?.value && city) {
            setLoading(true);
            searchStop(inputRef.current.value, city)
                .then((data) => {
                    setResult([...data]);
                    setLoading(false);
                })
                .catch((err) => alert(err));
        }
    };

    const handleEnter = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && inputRef.current?.value && city) {
            await handleSearch();
        }
    };

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    return (
        <Popup open={open} onClose={() => setOpen(false)}>
            <div className="flex w-[95vw] flex-col  items-center gap-3 rounded-lg bg-white p-4 transition-all md:w-[40rem]">
                <h3 className="w-full text-center text-xl">搜尋站牌</h3>
                <div className="flex w-full gap-2">
                    <Input
                        onKeyDown={handleEnter}
                        ref={inputRef}
                        className="flex-grow text-lg"
                    />
                    <Button onClick={handleSearch} className="bg-slate-700">
                        {loading ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSearch />
                        )}
                    </Button>
                </div>
                <ScrollArea className="w-full">
                    <div className="max-h-[70vh] w-full">
                        {result
                            ?.map((d) => d.StopName.Zh_tw)
                            .filter((d, i, arr) => arr.indexOf(d) === i)
                            .map((item, index) => {
                                return (
                                    <>
                                        {index !== 0 && (
                                            <div className="mx-1 w-full border-t-[0.05rem] border-slate-100" />
                                        )}
                                        <div
                                            onClick={() => {
                                                setOpen(false);
                                                setURLSearchParams([
                                                    {
                                                        key: "station",
                                                        value: item,
                                                    },
                                                ]);
                                            }}
                                            key={`${item}`}
                                            className="rounded-md p-2 py-3 transition-all hover:cursor-pointer hover:bg-slate-100"
                                        >
                                            {item}
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </ScrollArea>
                <Button className="w-fit" onClick={() => setOpen(false)}>
                    取消
                </Button>
            </div>
        </Popup>
    );
}

const BusList = ({
    list,
    bus,
    direction,
    city,
    setOpenInfo,
    setCurrentBus,
}: {
    list?: BusRoutePassBy[];
    bus: string;
    direction: string;
    city: string;
    setOpenInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentBus: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const busOverlay = useAtomValue(overlayAtom);
    const add_remove_overlay = useOverlay({ city });
    const setURLSearchParams = useSetURLSearchParams();
    const setPage = useSetAtom(pageAtom);

    return (
        <>
            {list
                ?.sort(
                    (a, b) =>
                        Number(RNN(a.RouteName.Zh_tw)) -
                        Number(RNN(b.RouteName.Zh_tw))
                )
                .map((item) => {
                    const isOverlayed = !!busOverlay[city]?.find(
                        (d) =>
                            d.RouteName.Zh_tw === item.RouteName.Zh_tw &&
                            item.Direction === Number(direction)
                    );
                    return (
                        <div
                            key={`${item.Direction} ${item.RouteName.Zh_tw} ${item.StopSequence}`}
                            className="w-full flex justify-between text-white"
                        >
                            <div className="h-full flex items-center gap-2">
                                <RemainningTime
                                    EstimateTime={item.EstimateTime}
                                    NextBusTime={item.NextBusTime}
                                />
                                <button
                                    onClick={() => {
                                        setURLSearchParams([
                                            {
                                                key: "bus",
                                                value: item.RouteName.Zh_tw,
                                            },
                                            {
                                                key: "direction",
                                                value: String(
                                                    item.Direction === 255
                                                        ? 0
                                                        : item.Direction
                                                ),
                                            },
                                        ]);
                                    }}
                                    className="relative group"
                                >
                                    <span>{item.RouteName.Zh_tw}</span>
                                    <span
                                        className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all ${
                                            bus === item.RouteName.Zh_tw &&
                                            direction === `${item.Direction}` &&
                                            "w-1/2"
                                        }`}
                                    ></span>
                                    <span
                                        className={`absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all ${
                                            bus === item.RouteName.Zh_tw &&
                                            direction === `${item.Direction}` &&
                                            "w-1/2"
                                        }`}
                                    ></span>
                                </button>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="bg-transparant h-fit  w-fit -translate-x-2 rounded border-[1px] border-white p-1 text-center font-bold text-white transition-all hover:bg-white hover:text-black">
                                        <FiMenu />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={()=>{
                                        setCurrentBus(item.RouteName.Zh_tw)
                                        setOpenInfo(true)
                                    }}>
                                        <span>發車資訊</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setPage("bus");
                                            setURLSearchParams([
                                                {
                                                    key: "bus",
                                                    value: item.RouteName.Zh_tw,
                                                },
                                                {
                                                    key: "direction",
                                                    value: String(
                                                        item.Direction === 255
                                                            ? 0
                                                            : item.Direction
                                                    ),
                                                },
                                                {
                                                    key: "page",
                                                    value: "bus",
                                                },
                                            ]);
                                        }}
                                    >
                                        <span>查看路線</span>
                                    </DropdownMenuItem>
                                    {bus === item.RouteName.Zh_tw &&
                                        Number(direction) ===
                                            item.Direction && (
                                            <DropdownMenuItem
                                                onClick={add_remove_overlay}
                                            >
                                                <span>
                                                    {isOverlayed
                                                        ? "移除疊加路線"
                                                        : "新增疊加路線"}
                                                </span>
                                            </DropdownMenuItem>
                                        )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                })}
        </>
    );
};
