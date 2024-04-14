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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAtom, type SetStateAction, useSetAtom } from "jotai";
import { FaCircleInfo, FaTrash } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import {
    cityRailwayOverlayAtom,
    // overlayAtom,
    pageAtom,
    showCityOverlayAtom,
    showCityRailwayOverlayAtom,
    togglePolylineAtom,
    useOverlayStore,
} from "@/state/busState";
import { useSetURLSearchParams } from "@/hooks/useSetURLSearchParams";
import { Switch } from "@/components/ui/switch";
import { cityList, cityRailwayList, cityRailwayToColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOverlayColor } from "@/hooks/useOverlayColor";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { CityRailwayOverlay } from "@/type/cityRailwayType";
import { CiShare1 } from "react-icons/ci";
import CardTopDivider from "./CardTopDivider";

const PopupInfo = dynamic(() => import("./PopupInfo"), { ssr: false });
export default function Overlay({ city }: { city: string }) {
    const { busOverlay, show_CityOverlay, hide_CityOverlay } =
        useOverlayStore();
    const [cityRailwayOverlay, setCityRailwayOverlay] = useAtom(
        cityRailwayOverlayAtom
    );
    const [showCityOverlay, setShowCityOverlay] = useAtom(showCityOverlayAtom);
    const [showCityRailwayOverlay, setShowCityRailwayOverlay] = useAtom(
        showCityRailwayOverlayAtom
    );
    const d = useOverlayStore();
    const router = useRouter();

    return (
        <div className="w-full h-full flex flex-col min-h-0">
            <div className="w-full flex gap-1 pb-2 items-center h-fit min-h-0">
                <span className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md transition-all">
                    Overlay
                </span>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className=" bg-transparent text-sky-200 py-1 flex-shrink-0 px-3 border-[1px] border-sky-200 rounded-md transition-all hover:bg-sky-200 hover:text-black">
                            選擇顯示城市
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-wrap w-full">
                                {cityList.map((item) => {
                                    const checked = showCityOverlay.some(
                                        (d) => d === item.value
                                    );
                                    return (
                                        <div
                                            key={`popupover-content ${item.label}`}
                                            className="flex items-center p-1 gap-1"
                                        >
                                            <Checkbox
                                                id={item.value}
                                                checked={checked}
                                                onClick={() => {
                                                    setShowCityOverlay(
                                                        (prev) => {
                                                            if (
                                                                prev.includes(
                                                                    item.value
                                                                )
                                                            ) {
                                                                return prev.filter(
                                                                    (d) =>
                                                                        d !==
                                                                        item.value
                                                                );
                                                            }
                                                            return [
                                                                ...prev,
                                                                item.value,
                                                            ];
                                                        }
                                                    );
                                                }}
                                            />
                                            <Label htmlFor={item.value}>
                                                {item.label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                            <Separator />
                            <div className="flex flex-wrap w-full">
                                {cityRailwayList.map((item) => {
                                    const checked = showCityRailwayOverlay.some(
                                        (d) => d === item.value
                                    );
                                    return (
                                        <div
                                            key={`popover-content ${item.label}`}
                                            className="flex items-center p-1 gap-1"
                                        >
                                            <Checkbox
                                                id={item.value}
                                                checked={checked}
                                                onClick={() => {
                                                    setShowCityRailwayOverlay(
                                                        (prev) => {
                                                            if (
                                                                prev.includes(
                                                                    item.value
                                                                )
                                                            ) {
                                                                return prev.filter(
                                                                    (d) =>
                                                                        d !==
                                                                        item.value
                                                                );
                                                            }
                                                            return [
                                                                ...prev,
                                                                item.value,
                                                            ];
                                                        }
                                                    );
                                                }}
                                            />
                                            <Label htmlFor={item.value}>
                                                {item.label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="flex-grow"></div>
                <div className="flex h-full items-end py-1 text-sm text-gray-300 gap-2">
                    <button
                        className="transition-all hover:text-orange-200"
                        onClick={() => {
                            show_CityOverlay(showCityOverlay);
                            setCityRailwayOverlay((prev) => {
                                showCityRailwayOverlay.forEach((c) => {
                                    const newArr = prev[c]?.map((d) => {
                                        d.ShowOverlay = true;
                                        return d;
                                    });
                                    if (!newArr) {
                                        return { ...prev };
                                    }
                                    prev[c] = newArr;
                                });
                                return { ...prev };
                            });
                        }}
                    >
                        全部顯示
                    </button>
                    <p className="h-full border-r-[1px] border-gray-300 translate-y-[2px]"></p>
                    <button
                        className="transition-all hover:text-orange-200"
                        onClick={() => {
                            hide_CityOverlay(showCityOverlay);
                            setCityRailwayOverlay((prev) => {
                                showCityRailwayOverlay.forEach((c) => {
                                    const newArr = prev[c]?.map((d) => {
                                        d.ShowOverlay = false;
                                        return d;
                                    });
                                    if (!newArr) {
                                        return { ...prev };
                                    }
                                    prev[c] = newArr;
                                });
                                return { ...prev };
                            });
                        }}
                    >
                        全部隱藏
                    </button>
                </div>
            </div>
            <CardTopDivider />
            <ScrollArea className="w-full h-full p-1 pr-3">
                {/* {JSON.stringify(d.busOverlay)} */}
                {showCityOverlay.map((c) => {
                    return (
                        <OverlayList
                            key={`overlay page show list ${c}`}
                            busOverlay={busOverlay}
                            c={c}
                            city={city}
                            router={router}
                        />
                    );
                })}
                {showCityRailwayOverlay.map((c) => {
                    return (
                        <CityRailwayOverlayList
                            key={`city railway overlay ${c}`}
                            c={c}
                            cityRailwayOverlay={cityRailwayOverlay[c]}
                            setCityRailwayOverlay={setCityRailwayOverlay}
                        />
                    );
                })}
            </ScrollArea>
        </div>
    );
}

const OverlayList = ({
    busOverlay,
    // setBusOverlay,
    c,
    city,
    router,
}: {
    busOverlay: { [key: string]: BusOverlay[] | undefined };
    // setBusOverlay: SetAtom<
    //     [SetStateAction<{ [key: string]: BusOverlay[] | undefined }>],
    //     void
    // >;
    c: string;
    city: string;
    router: AppRouterInstance;
}) => {
    const setURLSearchParams = useSetURLSearchParams();
    const { toast } = useToast();
    const setTogglePolyline = useSetAtom(togglePolylineAtom);
    const setPage = useSetAtom(pageAtom);
    const getColor = useOverlayColor();
    const [openAlert, setOpenAlert] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [currentBus, setCurrentBus] = useState("");
    const [currentDirection, setCurrentDirection] = useState(0);
    const {
        removeOverlay,
        show_CityOverlay,
        hide_CityOverlay,
        toggle_CityOverlay,
    } = useOverlayStore();

    const handleRemove = (
        name: string,
        direction: number,
        headSign: string
    ) => {
        removeOverlay(c, name, `${direction}`);
        toast({
            title: "刪除成功",
            description: `${name}（${headSign}）`,
            className: "bg-red-100",
        });
    };

    return (
        <>
            <PopupInfo
                city={c}
                bus={currentBus}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            />
            <div className="flex w-full flex-col gap-1">
                <div className="flex mt-3 -mb-1 gap-2">
                    <Badge className="w-fit">
                        {cityList.find((d) => d.value === c)?.label}
                    </Badge>
                    <div className="flex  transition-all text-xs gap-2  items-center">
                        <button
                            className="text-gray-300 hover:text-orange-200"
                            onClick={() => {
                                show_CityOverlay([c]);
                            }}
                        >
                            全部顯示
                        </button>
                        <Separator orientation="vertical" />
                        <button
                            className="text-gray-300 hover:text-orange-200"
                            onClick={() => {
                                hide_CityOverlay([c]);
                            }}
                        >
                            全部隱藏
                        </button>
                    </div>
                </div>
                {busOverlay[c]?.map((item) => {
                    const stopLength = item.Stops.length;
                    const headSign = `${item.Stops[0].StopName.Zh_tw} - ${
                        item.Stops[stopLength - 1].StopName.Zh_tw
                    }`;
                    return (
                        <div
                            key={`overlay ${item.RouteName.Zh_tw} ${item.Direction}`}
                            className="flex w-full items-center gap-4"
                        >
                            <div
                                className="h-full text-transparent -mr-2"
                                style={{
                                    backgroundColor: getColor(
                                        item.RouteName.Zh_tw
                                    ),
                                }}
                            >
                                |
                            </div>
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
                                <p className="text-xs text-gray-300">
                                    {headSign}
                                </p>
                                <span
                                    className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
                                ></span>
                                <span
                                    className={`absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
                                ></span>
                            </button>
                            <div className="box-border flex w-max items-center gap-1 px-1">
                                <button
                                    onClick={() => {
                                        if (c !== city) {
                                            setCurrentBus(item.RouteName.Zh_tw);
                                            setCurrentDirection(item.Direction);
                                            setOpenAlert(true);
                                            return;
                                        }
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
                                    className="bg-transparant h-fit border-transparent w-fit -translate-x-2 rounded border-[1px] hover:border-white p-1 text-center font-bold text-white transition-all hover:bg-white hover:text-black"
                                >
                                    <CiShare1 />
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="bg-transparant h-fit border-transparent w-fit -translate-x-2 rounded border-[1px] hover:border-white p-1 text-center font-bold text-white transition-all hover:bg-white hover:text-black">
                                            <FiMenu />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setCurrentBus(
                                                    item.RouteName.Zh_tw
                                                );
                                                setOpenPopup(true);
                                            }}
                                        >
                                            <span className="flex items-center gap-1">
                                                <FaCircleInfo className="text-slate-700" />
                                                發車資訊
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                handleRemove(
                                                    item.RouteName.Zh_tw,
                                                    item.Direction,
                                                    headSign
                                                );
                                            }}
                                        >
                                            <span className="flex items-center gap-1">
                                                <FaTrash className="text-red-700" />
                                                刪除疊加
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Switch
                                    checked={item.ShowOverlay}
                                    className="-ml-1"
                                    onCheckedChange={(e) => {
                                        toggle_CityOverlay(
                                            c,
                                            item.RouteName.Zh_tw,
                                            `${item.Direction}`,
                                            e
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                <Alert
                    openAlert={openAlert}
                    setOpenAlert={setOpenAlert}
                    bus={currentBus}
                    direction={currentDirection}
                    router={router}
                    c={c}
                    city={city}
                />
            </div>
        </>
    );
};

const CityRailwayOverlayList = ({
    c,
    cityRailwayOverlay,
    setCityRailwayOverlay,
}: {
    c: string;
    cityRailwayOverlay?: CityRailwayOverlay[];
    setCityRailwayOverlay: SetAtom<
        [
            SetStateAction<{
                [key: string]: CityRailwayOverlay[] | undefined;
            }>
        ],
        void
    >;
}) => {
    const setTogglePolyline = useSetAtom(togglePolylineAtom);
    const name = cityRailwayList.find((d) => d.value === c)?.label;
    return (
        <div className="flex w-full flex-col gap-1">
            <div className="flex mt-3 -mb-1 gap-2">
                <Badge className="w-fit">{name}</Badge>
                <div className="flex  transition-all text-xs gap-2  items-center">
                    <button
                        onClick={() => {
                            setCityRailwayOverlay((prev) => {
                                const newArr = prev[c]?.map((item) => {
                                    item.ShowOverlay = true;
                                    return item;
                                });
                                if (!newArr) {
                                    return { ...prev };
                                }
                                prev[c] = newArr;
                                return { ...prev };
                            });
                        }}
                        className="text-gray-300 hover:text-orange-200"
                    >
                        全部顯示
                    </button>
                    <Separator orientation="vertical" />
                    <button
                        onClick={() => {
                            setCityRailwayOverlay((prev) => {
                                const newArr = prev[c]?.map((item) => {
                                    item.ShowOverlay = false;
                                    return item;
                                });
                                if (!newArr) {
                                    return { ...prev };
                                }
                                prev[c] = newArr;
                                return { ...prev };
                            });
                        }}
                        className="text-gray-300 hover:text-orange-200"
                    >
                        全部隱藏
                    </button>
                </div>
            </div>
            {cityRailwayOverlay?.map((item) => {
                const a = cityRailwayToColor[c];
                const color = a ? a[item.LineID] : "";
                const headSign = `${item.Stations[0].StationName.Zh_tw} - ${
                    item.Stations[item.Stations.length - 1].StationName.Zh_tw
                }`;
                return (
                    <div
                        key={`cityRailway overlay ${item.LineName.Zh_tw}`}
                        className="flex w-full items-center gap-4"
                    >
                        <div
                            className="h-full text-transparent -mr-2"
                            style={{
                                backgroundColor: color,
                            }}
                        >
                            |
                        </div>
                        <button
                            onClick={() => {
                                setTogglePolyline((prev) => {
                                    prev.routeName = item.LineName.Zh_tw;
                                    prev.direction = undefined;
                                    prev.id = prev.id > 10 ? 1 : prev.id++;
                                    return { ...prev };
                                });
                            }}
                            className="relative group text-white p-1 text-left w-full"
                        >
                            <p>{item.LineName.Zh_tw}</p>
                            <p className="text-xs text-gray-300">{headSign}</p>
                            <span
                                className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
                            ></span>
                            <span
                                className={`absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all`}
                            ></span>
                        </button>
                        <div className="box-border flex w-max items-center gap-1 px-1">
                            <Switch
                                checked={item.ShowOverlay}
                                className="-ml-1"
                                onCheckedChange={(e) => {
                                    setCityRailwayOverlay((prev) => {
                                        const newArr = prev[c]?.map((d) => {
                                            if (
                                                d.LineName.Zh_tw ===
                                                item.LineName.Zh_tw
                                            ) {
                                                d.ShowOverlay = e;
                                                return d;
                                            }
                                            return d;
                                        });
                                        if (!newArr) {
                                            return { ...prev };
                                        }
                                        prev[c] = newArr;
                                        return { ...prev };
                                    });
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Alert = ({
    openAlert,
    setOpenAlert,
    router,
    bus,
    direction,
    c,
    city,
}: {
    openAlert: boolean;
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
    router: AppRouterInstance;
    bus: string;
    direction: number;
    c: string;
    city: string;
}) => {
    return (
        <AlertDialog open={openAlert} onOpenChange={(e) => setOpenAlert(e)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>即將切換地區</AlertDialogTitle>
                    <AlertDialogDescription>
                        {`${bus} `}路線並不屬於
                        {cityList.find((d) => d.value === city)?.label}
                        公車，因此須轉移區域到
                        {cityList.find((d) => d.value === c)?.label}
                        才能正常顯示
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            router.push(
                                `/bus/${c}?bus=${bus}&direction=${direction}&page=bus`
                            );
                        }}
                    >
                        切換區域
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
