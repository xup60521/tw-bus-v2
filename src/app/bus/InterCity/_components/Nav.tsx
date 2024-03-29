"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Bus from "./Bus";
// import Station from "./Station";
import type { BusList } from "@/type/busType";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import ReactQuery from "./ReactQueryClient";
import { useEffect, useState } from "react";
import { getAllBus } from "@/server_action/getAllBus";
import { useHydrateAtoms } from "jotai/utils";
import { busShapeAtom, busStopsAtom, pageAtom } from "@/state/busState";
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
import { InterCityBusListType } from "@/type/interCityBusType";
import { getInterCityBusStops } from "@/server_action/InterCity/getInterCityBusStops";
import { getInterCityBusShape } from "@/server_action/InterCity/getInterCityBusShape";
import Overlay from "../../[city]/_components/Overlay";
import Station from "./Station";
import Plan from "./Plan";
// import Plan from "./Plan";

// const Overlay = dynamic(() => import("./Overlay"), { ssr: false });

export default function Nav({
    city,
    initBusList,
}: {
    city: string;
    initBusList: InterCityBusListType[];
}) {
    const searchParams = useSearchParams();
    useHydrateAtoms([[pageAtom, searchParams.get("page") ?? "bus"]]);
    const page = useAtomValue(pageAtom);
    const setBusShape = useSetAtom(busShapeAtom);
    const setBusStops = useSetAtom(busStopsAtom);
    const bus = searchParams.get("bus") ?? "";
    const router = useRouter();

    useEffect(() => {
        getInterCityBusStops(bus).then((res) => {
            const data = res.map((d) => {
                d.RouteName = d.SubRouteName;
                return d;
            });
            setBusStops([...data]);
        });
        getInterCityBusShape(bus).then((res) => {
            const data = res.map((d) => {
                d.RouteName = d.SubRouteName;
                return d;
            });
            setBusShape([...data]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bus]);

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
                    return <Plan city={city} />
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
