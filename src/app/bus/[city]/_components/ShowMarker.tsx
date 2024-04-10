"use client";

import { Icon, DivIcon } from "leaflet";
import type L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { useAtomValue } from "jotai";
import type { Unpacked } from "@/type/unpacked";
import type { BusStops } from "@/type/busType";
import { toggleStopAtom } from "@/state/busState";

export default function ShowMarker({
    item,
    currentStation,
    icon,
    tooltipDisplay,
    popupText,
}: {
    item: Unpacked<BusStops["Stops"]>;
    currentStation: string;
    icon?: L.Icon | L.DivIcon;
    tooltipDisplay?: {
        display: boolean;
        text: string;
    };
    popupText?: {
        name: string;
        color: string;
    }[];
}) {
    const ref = useRef<L.Marker>(null);
    const toggleStop = useAtomValue(toggleStopAtom);
    const pin_inv = new Icon({
        iconUrl: "/pin_inv.png",
        iconSize: [16, 48],
    });
    const icon_red = new Icon({
        iconUrl: "/pin_red.png",
        iconSize: [32, 96],
    });

    useEffect(() => {
        if (toggleStop?.stopName === item.StopName.Zh_tw) {
            ref.current?.openPopup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleStop]);

    return (
        <Marker
            ref={ref}
            riseOffset={-12}
            icon={
                icon
                    ? icon
                    : currentStation === item.StopName.Zh_tw
                    ? icon_red
                    : pin_inv
            }
            key={`${item.StopSequence}`}
            position={[
                item.StopPosition.PositionLat,
                item.StopPosition.PositionLon,
            ]}
            zIndexOffset={
                currentStation === item.StopName.Zh_tw ? -500 : undefined
            }
        >
            <Popup>
                {popupText ? (
                    <div className="flex flex-col gap-2">
                        <span className="">{item.StopName.Zh_tw}</span>
                        <div className="flex flex-wrap gap-1">
                            {popupText.map((d) => {
                                return (
                                    <span
                                        key={`overlay stopname ${item.StopName.Zh_tw} ${d.name}`}
                                        className=" border-l-4 px-1"
                                        style={{ borderColor: d.color }}
                                    >
                                        {d.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>{`${item.StopSequence} ${item.StopName.Zh_tw}`}</p>
                    </div>
                )}
            </Popup>
            <Tooltip
                permanent={tooltipDisplay ? tooltipDisplay.display : true}
                direction="bottom"
            >
                <div>
                    <p>{`${
                        tooltipDisplay ? tooltipDisplay.text : item.StopSequence
                    }`}</p>
                </div>
            </Tooltip>
        </Marker>
    );
}
