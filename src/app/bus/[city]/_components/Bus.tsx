"use client";

import { RNN } from "@/lib/utils";
import type { BusEst, BusList, BusStops } from "@/type/busType";
import { Fragment, useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    SetURLSearchParamsInputProps,
    useSetURLSearchParams,
} from "@/hooks/useSetURLSearchParams";
import { Button } from "@/components/ui/button";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { getBusEst } from "@/server_action/getBusEst";
import { useAtomValue, useSetAtom } from "jotai";
import {
    // overlayAtom,
    pageAtom,
    toggleStopAtom,
    useBusStopsGeoStore,
    useOverlayStore,
} from "@/state/busState";
import { useQuery } from "@tanstack/react-query";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMenu, FiMinus, FiPlus } from "react-icons/fi";
import { useOverlay } from "@/hooks/useOverlay";
import { useSeparateStops } from "@/hooks/useSeparateStops";
import RemainningTime from "./RemainningTime";
import { FaInfo } from "react-icons/fa6";
import dynamic from "next/dynamic";
import "@/styles/scrollbar-drawer.css";
// import scrollbar from "@/styles/scrollbar.module.css"

const PopupInfo = dynamic(() => import("./PopupInfo"), { ssr: false });
export default function Bus({
    city,
    initBusList,
}: {
    city: string;
    initBusList: BusList[];
}) {
    const setURLSearchParams = useSetURLSearchParams();
    const searchParams = useSearchParams();
    const bus = searchParams.get("bus") ?? "";
    const [direction, setDirection] = useState(
        searchParams.get("direction") ?? ""
    );
    const [open, setOpen] = useState(false);
    // const busStops = useAtomValue(busStopsAtom);
    const { busStops } = useBusStopsGeoStore();
    const busEst = useQuery({
        queryKey: ["busEst"],
        queryFn: () => getBusEst(city, bus),
        // enabled: !!bus,
        refetchInterval: 15000,
    });

    const {
        busStops0,
        headto0,
        busStops1,
        headto1,
        direction0,
        direction1,
        isOneWay,
    } = useSeparateStops(busStops, busEst.data);
    const add_remove_overlay = useOverlay({ city });
    const {busOverlay} = useOverlayStore()
    const isOverlayed = !!busOverlay[city]?.find(
        (d) => d.RouteName.Zh_tw === bus && d.Direction === Number(direction)
    );

    useEffect(() => {
        busEst.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bus]);

    return (
        <>
            <div className="w-full h-full flex flex-col min-h-0">
                <div className="w-full flex gap-1 items-start pb-2 h-fit min-h-0">
                    <button
                        className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all hover:bg-white hover:text-black"
                        onClick={() => setOpen(true)}
                    >
                        {bus ? bus : "選擇公車"}
                    </button>
                    {bus && (
                        <>
                            <button
                                onClick={add_remove_overlay}
                                className={`box-border flex px-2  py-2 items-center justify-center rounded-md border-[1px] text-white font-bold transition-all ${
                                    isOverlayed
                                        ? "border-red-300 text-red-300 hover:bg-red-300 hover:text-white"
                                        : " border-white hover:bg-white hover:text-slate-700"
                                }`}
                            >
                                {isOverlayed ? <FiMinus /> : <FiPlus />}
                            </button>
                            <div
                                className={`w-full ${
                                    isOneWay ? "" : "grid grid-cols-2 gap-1"
                                } relative`}
                            >
                                <button
                                    className={`truncate min-h-full rounded-md py-1 text-center border-[1px] font-semibold transition  border-white hover:bg-white hover:text-black ${
                                        isOneWay ? "w-full" : ""
                                    } z-20 ${
                                        direction === "0"
                                            ? "bg-white text-black"
                                            : "text-white"
                                    }`}
                                    onClick={() => {
                                        setDirection("0");
                                        setURLSearchParams([
                                            { key: "direction", value: "0" },
                                        ]);
                                    }}
                                >
                                    {headto0 ? `往${headto0}` : " "}
                                </button>
                                {isOneWay ? (
                                    ""
                                ) : (
                                    <button
                                        className={`z-20 truncate min-h-full rounded-md p-1 text-center font-semibold border-[1px] transition border-white hover:bg-white hover:text-black ${
                                            direction === "1"
                                                ? "text-black bg-white"
                                                : "text-white"
                                        }`}
                                        onClick={() => {
                                            setDirection("1");
                                            setURLSearchParams([
                                                {
                                                    key: "direction",
                                                    value: "1",
                                                },
                                            ]);
                                        }}
                                    >
                                        {headto1 ? `往${headto1}` : " "}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="w-full border-t-[1px] border-white"></div>
                <ScrollArea className="w-full h-full">
                    <div className="flex w-full flex-col gap-1 py-[6px] pr-2">
                        {!!bus && (
                            <StopList
                                list={
                                    direction === "0" ? direction0 : direction1
                                }
                                stops={
                                    direction === "0" ? busStops0 : busStops1
                                }
                                setURLSearchParams={setURLSearchParams}
                                searchParams={searchParams}
                            />
                        )}
                    </div>
                </ScrollArea>
            </div>
            {!!initBusList.length && <DrawerSection
                initBusList={initBusList}
                open={open}
                setDirection={setDirection}
                setOpen={setOpen}
                setURLSearchParams={setURLSearchParams}
                bus={bus}
                city={city}
            />}
        </>
    );
}

function DrawerSection({
    initBusList,
    open,
    setOpen,
    bus,
    setDirection,
    setURLSearchParams,
    city,
}: {
    initBusList: BusList[];
    open: boolean;
    bus: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDirection: React.Dispatch<React.SetStateAction<string>>;
    setURLSearchParams: (prop: SetURLSearchParamsInputProps[]) => void;
    city: string;
    // setBus: SetAtom<[SetStateAction<string>], void>;
    // setDirection: SetAtom<[SetStateAction<string>], void>;
    // router: AppRouterInstance;
}) {
    const [qString, setQString] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const [openPopup, setOpenPopup] = useState(false);
    if (!Array.isArray(initBusList)) {
        return null;
    }

    const data = structuredClone(initBusList)
        .sort(
            (a, b) =>
                Number(RNN(a.RouteName.Zh_tw)) - Number(RNN(b.RouteName.Zh_tw))
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
            <Drawer
                onClose={() => {
                    setOpen(false);
                    setQString("");
                }}
                open={open}
            >
                <DrawerContent
                    onInteractOutside={() => setOpen(false)}
                    onEscapeKeyDown={() => setOpen(false)}
                >
                    <DrawerHeader>
                        <DrawerTitle asChild>
                            <div className="flex justify-between items-center">
                                <p>選擇公車</p>
                                {bus ? (
                                    <div className="flex gap-2 items-center">
                                        <p>{bus}</p>
                                        <button
                                            onClick={() => {
                                                closeBtnRef.current?.click();
                                                setOpenPopup(true);
                                            }}
                                            className=" text-xs border-2 transition-all hover:bg-slate-700 hover:text-white rounded border-slate-700 p-1"
                                        >
                                            <FaInfo />
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-col items-center">
                        <Input
                            ref={inputRef}
                            value={qString}
                            className="text-lg"
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
                        <div className="h-[60vh] w-full">
                            <div className="w-full flex flex-col">
                                {city !== "InterCity" ? (
                                    <Virtuoso
                                        style={{
                                            height: "60vh",
                                            overflowX: "hidden",
                                        }}
                                        totalCount={data.length + 1}
                                        itemContent={(index) => {
                                            if (index === 0) {
                                                return (
                                                    <div
                                                        onClick={() => {
                                                            setURLSearchParams([
                                                                {
                                                                    key: "bus",
                                                                    value: "",
                                                                },
                                                                {
                                                                    key: "direction",
                                                                    value: "",
                                                                },
                                                            ]);
                                                            setDirection("");
                                                            setOpen(false);
                                                        }}
                                                        className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                                                    >
                                                        取消選取
                                                    </div>
                                                );
                                            }
                                            const item = data[index - 1];
                                            return (
                                                <Fragment
                                                    key={`fragment ${item.SubRoutes[0].SubRouteName.Zh_tw}`}
                                                >
                                                    <div className="w-full border-t-[0.05rem] border-slate-100 mx-1" />

                                                    <div
                                                        onClick={() => {
                                                            closeBtnRef.current?.click();
                                                            setQString("");
                                                            setDirection("0");
                                                            setURLSearchParams([
                                                                {
                                                                    key: "bus",
                                                                    value: item
                                                                        .RouteName
                                                                        .Zh_tw,
                                                                },
                                                                {
                                                                    key: "direction",
                                                                    value: "0",
                                                                },
                                                            ]);
                                                        }}
                                                        className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                                                    >
                                                        {item.headSign}
                                                    </div>
                                                </Fragment>
                                            );
                                        }}
                                    />
                                ) : (
                                    (() => {
                                        const list = data
                                            .map((d) => {
                                                return d.SubRoutes.map(
                                                    (item) => {
                                                        return (
                                                            <Fragment
                                                                key={`fragment ${item.Direction} ${item.SubRouteName.Zh_tw}`}
                                                            >
                                                                <div className="w-full border-t-[0.05rem] border-slate-100 mx-1" />

                                                                <div
                                                                    onClick={() => {
                                                                        closeBtnRef.current?.click();
                                                                        setQString(
                                                                            ""
                                                                        );
                                                                        setDirection(
                                                                            "0"
                                                                        );
                                                                        setURLSearchParams(
                                                                            [
                                                                                {
                                                                                    key: "bus",
                                                                                    value: item
                                                                                        .SubRouteName
                                                                                        .Zh_tw,
                                                                                },
                                                                                {
                                                                                    key: "direction",
                                                                                    value: `${item.Direction}`,
                                                                                },
                                                                            ]
                                                                        );
                                                                    }}
                                                                    className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                                                                >
                                                                    {`${item.SubRouteName.Zh_tw} ${item.Headsign}`}
                                                                </div>
                                                            </Fragment>
                                                        );
                                                    }
                                                );
                                            })
                                            .flat();
                                        return (
                                            <Virtuoso
                                                style={{
                                                    height: "60vh",
                                                    overflowX: "hidden",
                                                }}
                                                totalCount={list.length + 1}
                                                itemContent={(index) => {
                                                    if (index === 0) {
                                                        return (
                                                            <div
                                                                onClick={() => {
                                                                    setURLSearchParams(
                                                                        [
                                                                            {
                                                                                key: "bus",
                                                                                value: "",
                                                                            },
                                                                            {
                                                                                key: "direction",
                                                                                value: "",
                                                                            },
                                                                        ]
                                                                    );
                                                                    setDirection(
                                                                        ""
                                                                    );
                                                                    setOpen(
                                                                        false
                                                                    );
                                                                }}
                                                                className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                                                            >
                                                                取消選取
                                                            </div>
                                                        );
                                                    }
                                                    return list[index - 1];
                                                }}
                                            />
                                        );
                                    })()
                                )}
                            </div>
                        </div>

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
            <PopupInfo
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                bus={bus}
                city={city}
            />
        </>
    );
}

const StopList = ({
    list,
    stops,
    setURLSearchParams,
    searchParams,
}: {
    list?: BusEst[];
    stops?: BusStops["Stops"];
    setURLSearchParams: (prop: SetURLSearchParamsInputProps[]) => void;
    searchParams: ReadonlyURLSearchParams;
}) => {
    const setToggleStop = useSetAtom(toggleStopAtom);
    const station = searchParams.get("station") ?? "";
    const setPage = useSetAtom(pageAtom);
    if (!list) {
        return "";
    }

    return (
        <>
            {stops
                ?.sort((a, b) => a.StopSequence - b.StopSequence)
                .map((item) => {
                    let g = list.find(
                        (d) => d.StopSequence === item.StopSequence
                    );
                    if (!g) {
                        g = list.find(
                            (d) => d.StopName.Zh_tw === item.StopName.Zh_tw
                        );
                    }
                    return (
                        <div
                            className="flex w-full justify-between text-white"
                            key={`${item.StopSequence} ${item.StopName.Zh_tw}`}
                        >
                            <div className="flex h-full items-center gap-2">
                                <RemainningTime
                                    StopStatus={g?.StopStatus}
                                    EstimateTime={g?.EstimateTime}
                                    NextBusTime={g?.NextBusTime}
                                />
                                <button
                                    onClick={() => {
                                        setToggleStop((prev) => ({
                                            stopName: item.StopName.Zh_tw,
                                            id: prev.id + 1,
                                        }));
                                    }}
                                    className="group relative"
                                >
                                    <span>{item.StopName.Zh_tw}</span>
                                    <span
                                        className={`absolute -bottom-1 left-1/2 h-0.5 w-0 bg-red-400 group-hover:w-1/2 group-hover:transition-all 
                    ${station === item.StopName.Zh_tw ? "w-1/2" : ""}`}
                                    ></span>
                                    <span
                                        className={`absolute -bottom-1 right-1/2 h-0.5 w-0 bg-red-400 group-hover:w-1/2 group-hover:transition-all 
                    ${station === item.StopName.Zh_tw ? "w-1/2" : ""}`}
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
                                            setPage("station");
                                            setURLSearchParams([
                                                {
                                                    key: "station",
                                                    value: item.StopName.Zh_tw,
                                                },
                                                {
                                                    key: "page",
                                                    value: "station",
                                                },
                                            ]);
                                        }}
                                    >
                                        <span>查看站牌</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                })}
        </>
    );
};
