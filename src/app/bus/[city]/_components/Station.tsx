"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { pageAtom, useOverlayStore } from "@/state/busState";
import type { BusRoutePassBy } from "@/type/busType";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
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
import CardTopDivider from "./CardTopDivider";
import { CiShare1 } from "react-icons/ci";

const PopupInfo = dynamic(() => import("./PopupInfo"), { ssr: false });
const PopupSetStation = dynamic(() => import("./PopupSetStation"), {
    ssr: false,
});
export default function Station({ city }: { city: string }) {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const station = searchParams.get("station") ?? "";
    const direction = searchParams.get("direction") ?? "";
    const bus = searchParams.get("bus") ?? "";
    const data = useQuery({
        queryKey: ["routePassBy"],
        queryFn: () => getRoutePassBy(city, station),
        // enabled: !!station,
        refetchInterval: 15000,
    });
    const [openInfo, setOpenInfo] = useState(false);
    const [currentBus, setCurrentBus] = useState("");
    const setURLSearchParams = useSetURLSearchParams();

    const setStation = (item: string) => {
        setURLSearchParams([
            {
                key: "station",
                value: item,
            },
        ]);
    };

    useEffect(() => {
        data.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <CardTopDivider />
                <ScrollArea className="w-full h-full">
                    <div className="flex w-full flex-col gap-1 p-1 pl-0">
                        {data.isSuccess && <BusList
                            city={city}
                            bus={bus}
                            direction={direction}
                            list={data.data}
                            setOpenInfo={setOpenInfo}
                            setCurrentBus={setCurrentBus}
                        />}
                    </div>
                </ScrollArea>
            </div>
            <PopupInfo
                city={city}
                openPopup={openInfo}
                setOpenPopup={setOpenInfo}
                bus={currentBus}
            />
            <PopupSetStation
                setStation={setStation}
                city={city}
                setOpen={setOpen}
                open={open}
            />
        </>
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
    const { busOverlay } = useOverlayStore();
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
                                    StopStatus={item.StopStatus}
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
                            <div className="flex-grow"></div>
                            <div className="flex items-center gap-1 py-1">
                                <button
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
                                    className="bg-transparant h-fit  w-fit -translate-x-2 rounded border-[1px] border-transparent p-1 text-center font-bold text-white transition-all hover:border-white hover:bg-white hover:text-black"
                                >
                                    <CiShare1 />
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="bg-transparant h-fit  w-fit -translate-x-2 rounded border-[1px] border-transparent p-1 text-center font-bold text-white transition-all hover:bg-white hover:text-black hover:border-white">
                                            <FiMenu />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setCurrentBus(
                                                    item.RouteName.Zh_tw
                                                );
                                                setOpenInfo(true);
                                            }}
                                        >
                                            <span>發車資訊</span>
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
                        </div>
                    );
                })}
        </>
    );
};
