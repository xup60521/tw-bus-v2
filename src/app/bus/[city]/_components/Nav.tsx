"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Bus from "./Bus";
import Station from "./Station";
import type { BusList } from "@/type/busType";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import ReactQuery from "./ReactQueryClient";
import { useEffect, useState } from "react";
import { getAllBus } from "@/server_action/getAllBus";
import { useHydrateAtoms } from "jotai/utils";
import {
    cityRailwayOverlayAtom,
    pageAtom,
    showCityRailwayOverlayAtom,
    useBusStopsGeoStore,
} from "@/state/busState";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { getBusStops } from "@/server_action/getBusStops";
import { getBusShape } from "@/server_action/getBusShape";
import { LinearToArray, cityList } from "@/lib/utils";
import dynamic from "next/dynamic";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ReactSelect from "react-select";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Plan from "./Plan";
import { getLineGeo } from "@/server_action/cityRailway/getLineGeo";

const Overlay = dynamic(() => import("./Overlay"), { ssr: false });

export default function Nav({
    city,
    initBusList,
}: {
    city: string;
    initBusList: BusList[];
}) {
    const searchParams = useSearchParams();
    useHydrateAtoms([[pageAtom, searchParams.get("page") ?? "bus"]]);
    const page = useAtomValue(pageAtom);
    // const setBusShape = useSetAtom(busShapeAtom);
    // const setBusStops = useSetAtom(busStopsAtom);
    const { fetchStopsGeoData } = useBusStopsGeoStore();
    const [cityRailwayOverlay, setCityRailwayOverlay] = useAtom(
        cityRailwayOverlayAtom
    );
    const showCityRailwayOverlay = useAtomValue(showCityRailwayOverlayAtom);

    const bus = searchParams.get("bus") ?? "";
    const router = useRouter();

    useEffect(() => {
        if (bus && city) {
            fetchStopsGeoData(bus, city)
        }
        // if (bus) {
        //     getBusStops(bus, city)
        //         .then((stops) => {
        //             setBusStops([...stops]);
        //             getBusShape(bus, city)
        //                 .then((shapes) => {
        //                     const withDirectionData = shapes
        //                         .map((item, index, arr) => {
        //                             const d0 = stops
        //                                 .find(
        //                                     (d) =>
        //                                         d.Direction === 0 &&
        //                                         d.RouteName.Zh_tw === bus
        //                                 )
        //                                 ?.Stops.sort(
        //                                     (a, b) =>
        //                                         a.StopSequence - b.StopSequence
        //                                 )[0].StopPosition;
        //                             const d1 = stops
        //                                 .find(
        //                                     (d) =>
        //                                         d.Direction === 1 &&
        //                                         d.RouteName.Zh_tw === bus
        //                                 )
        //                                 ?.Stops.sort(
        //                                     (a, b) =>
        //                                         a.StopSequence - b.StopSequence
        //                                 )[0].StopPosition;
        //                             if (item.Direction) {
        //                                 return item;
        //                             } else if (arr.length === 2 && d0 && d1) {
        //                                 const position = LinearToArray(
        //                                     item.Geometry
        //                                 )[0] as [number, number];
        //                                 const length_to_d0 =
        //                                     (position[0] - d0.PositionLat) **
        //                                         2 +
        //                                     (position[1] - d0.PositionLon) ** 2;
        //                                 const length_to_d1 =
        //                                     (position[0] - d1.PositionLat) **
        //                                         2 +
        //                                     (position[1] - d1.PositionLon) ** 2;
        //                                 if (length_to_d0 >= length_to_d1) {
        //                                     item.Direction = 1;
        //                                 } else {
        //                                     item.Direction = 0;
        //                                 }

        //                                 return item;
        //                             } else {
        //                                 item.Direction = index;
        //                                 return item;
        //                             }
        //                         })
        //                         .sort((a, b) => a.Direction - b.Direction);
        //                     setBusShape([...withDirectionData]);
        //                 })
        //                 .catch((shapErr) => alert(shapErr));
        //         })
        //         .catch((StopsErr) => alert(StopsErr));
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bus]);

    useEffect(() => {
        let waitedforfetch = [...showCityRailwayOverlay];
        Object.keys(cityRailwayOverlay).forEach((d) => {
            if (waitedforfetch.includes(d)) {
                waitedforfetch = waitedforfetch.filter((a) => a !== d);
            }
        });
        if (waitedforfetch.length !== 0) {
            getLineGeo(waitedforfetch).then((res) => {
                setCityRailwayOverlay((prev) => {
                    return { ...prev, ...res };
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCityRailwayOverlay]);

    return (
        <>
            {(() => {
                if (page === "station") {
                    return <Station city={city} />;
                }
                if (page === "overlay") {
                    return <Overlay city={city} />;
                }
                if (page === "plan") {
                    return <Plan city={city} />;
                }
                return <Bus city={city} initBusList={initBusList} />;
            })()}
            <Controller city={city} router={router} />
        </>
    );
}

const Controller = ({
    city,
    router,
}: {
    city: string;
    router: AppRouterInstance;
}) => {
    const [page, setPage] = useAtom(pageAtom);
    const setURLSearchParams = useSetURLSearchParams();
    const [openSheet, setOpenSheet] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");

    return (
        <div className="absolute left-[50vw] top-2 box-border flex h-8 -translate-x-[50%] rounded-xl bg-white text-sm text-black md:top-[calc(100vh-2.5rem)] z-10">
            <Sheet open={openSheet} onOpenChange={(e) => setOpenSheet(e)}>
                <SheetTrigger asChild>
                    <button className="z-20 h-8 w-12 text-center font-bold rounded-xl hover:bg-slate-100 transition-all">
                        選單
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col">
                    <SheetHeader className="text-lg font-bold p-2 px-3">
                        選單
                    </SheetHeader>
                    <div className="flex flex-col w-full gap-2 flex-grow">
                        <button
                            onClick={() => {
                                setPage("bus");
                                setOpenSheet(false);
                                setURLSearchParams([
                                    {
                                        key: "page",
                                        value: "bus",
                                    },
                                ]);
                            }}
                            className={`w-full transition-all hover:bg-slate-100 rounded-lg text-left p-2 px-3 ${
                                page === "bus" ? "bg-slate-100" : ""
                            }`}
                        >
                            公車
                        </button>
                        <button
                            onClick={() => {
                                setPage("station");
                                setOpenSheet(false);
                                setURLSearchParams([
                                    {
                                        key: "page",
                                        value: "station",
                                    },
                                ]);
                            }}
                            className={`w-full transition-all hover:bg-slate-100 rounded-lg text-left p-2 px-3 ${
                                page === "station" ? "bg-slate-100" : ""
                            }`}
                        >
                            站牌
                        </button>
                        <button
                            onClick={() => {
                                setPage("plan");
                                setOpenSheet(false);
                                setURLSearchParams([
                                    {
                                        key: "page",
                                        value: "plan",
                                    },
                                ]);
                            }}
                            className={`w-full transition-all hover:bg-slate-100 rounded-lg text-left p-2 px-3 ${
                                page === "plan" ? "bg-slate-100" : ""
                            }`}
                        >
                            路線規劃
                        </button>
                        <button
                            onClick={() => {
                                setPage("overlay");
                                setOpenSheet(false);
                                setURLSearchParams([
                                    {
                                        key: "page",
                                        value: "overlay",
                                    },
                                ]);
                            }}
                            className={`w-full transition-all hover:bg-slate-100 rounded-lg text-left p-2 px-3 ${
                                page === "overlay" ? "bg-slate-100" : ""
                            }`}
                        >
                            疊加
                        </button>
                    </div>
                    <SheetFooter>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpenDialog(true)}
                                className="rounded-md text-slate-700 transition-all hover:bg-slate-700 hover:text-white py-2 px-3"
                            >
                                切換地區
                            </button>
                            <SheetClose asChild>
                                <button className="py-2 px-3 rounded-md bg-black text-white transition-all hover:bg-gray-800">
                                    關閉選單
                                </button>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Dialog open={openDialog} onOpenChange={(e) => setOpenDialog(e)}>
                <DialogContent className="-translate-y-48">
                    <DialogHeader>
                        <DialogTitle>切換顯示地區</DialogTitle>
                        <DialogDescription>
                            目前：
                            {cityList.find((d) => d.value === city)?.label}
                        </DialogDescription>
                    </DialogHeader>
                    <ReactSelect
                        options={cityList}
                        placeholder={"選擇城市..."}
                        onChange={(e) => setSelectedCity(e?.value ?? city)}
                    />
                    {selectedCity && selectedCity !== city && (
                        <div className="flex justify-start">
                            <button
                                onClick={() => {
                                    router.push(`/bus/${selectedCity}`);
                                }}
                                className="rounded-md bg-black px-3 py-2 text-white transition-all hover:bg-gray-700"
                            >
                                進入
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* <button
                className="z-20 h-8 w-12 text-center font-bold"
                onClick={() => {
                    setPage("bus");
                    setURLSearchParams([{ key: "page", value: "bus" }]);
                }}
            >
                公車
            </button>
            <button
                className="z-20 h-8 w-12 text-center font-bold"
                onClick={() => {
                    setPage("station");
                    setURLSearchParams([{ key: "page", value: "station" }]);
                }}
            >
                站牌
            </button>
            <button
                className="z-20 h-8 w-12 text-center font-bold"
                onClick={() => {
                    setPage("overlay");
                    setURLSearchParams([{ key: "page", value: "overlay" }]);
                }}
            >
                疊加
            </button>
            <div
                className={`
      absolute left-0 z-10 h-8 w-12 rounded-xl bg-orange-100 transition-all duration-300 
      ${
          page === "station"
              ? "translate-x-[100%]"
              : `${page === "overlay" ? "translate-x-[200%]" : ""}`
      }`}
            /> */}
        </div>
    );
};
