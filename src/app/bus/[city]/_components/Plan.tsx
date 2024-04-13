"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useOverlay } from "@/hooks/useOverlay";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import { RNN } from "@/lib/utils";
import { getPlanRoute } from "@/server_action/getPlanRoute";
import {
    // overlayAtom,
    pageAtom,
    planEndStationAtom,
    planResultAtom,
    planStartStationAtom,
    useOverlayStore,
} from "@/state/busState";
import type { SearchBus } from "@/type/busType";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const PopupInfo = dynamic(() => import("./PopupInfo"), { ssr: false });
const PopupSetStation = dynamic(() => import("./PopupSetStation"), {
    ssr: false,
});
export default function Plan({ city }: { city: string }) {
    const [openPopup1, setOpenPopup1] = useState(false);
    const [openPopup2, setOpenPopup2] = useState(false);
    const [planStartStation, setPlanStartStation] =
        useAtom(planStartStationAtom);
    const [planEndStation, setPlanEndStation] = useAtom(planEndStationAtom);
    const [searchResult, setSearchResult] = useAtom(planResultAtom);
    const searchParams = useSearchParams();
    const bus = searchParams.get("bus") ?? "";
    const direction = searchParams.get("direction") ?? "";
    const { toast } = useToast();
    const [openInfo, setOpenInfo] = useState(false);
    const [currentBus, setCurrentBus] = useState("");

    const handleSearchRoute = async () => {
        if (!planStartStation || !planEndStation) {
            toast({
                title: "請輸入站牌",
                className: "bg-red-100",
            });
            return;
        }
        getPlanRoute(city, planStartStation, planEndStation).then((res) =>
            setSearchResult([...res])
        );
    };

    useEffect(() => {
        if (!!planEndStation && !!planStartStation) {
        }
    }, [planEndStation, planStartStation]);

    return (
        <>
            <div className="w-full h-full flex flex-col min-h-0 gap-1">
                <div className="w-full flex gap-1 items-start text-sm pb-2 h-fit min-h-0">
                    <div className="flex-grow flex-col flex gap-1">
                        <button
                            onClick={() => setOpenPopup1(true)}
                            className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all hover:bg-white hover:text-black "
                        >
                            {planStartStation
                                ? planStartStation
                                : "選擇起始站牌..."}
                        </button>
                        <button
                            onClick={() => setOpenPopup2(true)}
                            className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all hover:bg-white hover:text-black "
                        >
                            {planEndStation
                                ? planEndStation
                                : "選擇終點站牌..."}
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setSearchResult(null);
                            handleSearchRoute();
                        }}
                        className="size-16 rounded-md  text-white text-xl flex items-center justify-center transition-all hover:bg-white hover:text-black"
                    >
                        <FaSearch />
                    </button>
                </div>
                <div className="w-full border-t-[1px] border-white"></div>
                <ScrollArea className="w-full h-full">
                    <div className="flex w-full flex-col gap-2 text-lg p-1">
                        <BusList
                            city={city}
                            bus={bus}
                            direction={direction}
                            list={searchResult}
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
            <PopupSetStation
                city={city}
                setStation={setPlanStartStation}
                setOpen={setOpenPopup1}
                open={openPopup1}
            />
            <PopupSetStation
                city={city}
                setStation={setPlanEndStation}
                setOpen={setOpenPopup2}
                open={openPopup2}
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
    list?: SearchBus[] | null;
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
    let filteredList: { RouteName: { Zh_tw: string }; Direction: number }[] =
        [];
    list?.forEach((d) => {
        if (
            !!filteredList.find(
                (itm) =>
                    itm.RouteName.Zh_tw === d.RouteName.Zh_tw &&
                    itm.Direction === d.Direction
            )
        ) {
            return;
        }
        filteredList = [
            ...filteredList,
            { RouteName: { Zh_tw: d.RouteName.Zh_tw }, Direction: d.Direction },
        ];
    });

    if (Array.isArray(list) && list.length === 0) {
        return (
            <div className="w-full p-8 text-center text-white">沒有結果</div>
        );
    }
    return (
        <>
            {filteredList
                .sort(
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
                            key={`planRoute ${item.Direction} ${item.RouteName.Zh_tw}`}
                            className="w-full flex justify-between text-white"
                        >
                            <div className="h-full flex items-center gap-2">
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
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setCurrentBus(item.RouteName.Zh_tw);
                                            setOpenInfo(true);
                                        }}
                                    >
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
