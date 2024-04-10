"use client";
import { Fragment, useEffect, useMemo } from "react";
import {
    LayersControl,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Tooltip,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import {
    busShapeAtom,
    busStopsAtom,
    cityRailwayOverlayAtom,
    overlayAtom,
    showCityOverlayAtom,
    showCityRailwayOverlayAtom,
} from "@/state/busState";
import type { BusGeo, BusOverlay, BusStops } from "@/type/busType";
import ShowMarker from "./ShowMarker";
import ShowPolyline from "./ShowPolyline";
import { DivIcon } from "leaflet";
import { useOverlayColor } from "@/hooks/useOverlayColor";
import {
    LinearToArray,
    MultilinearToArray,
    cityRailwayToColor,
} from "@/lib/utils";
import { CityRailwayGeo, CityRailwayStation } from "@/type/cityRailwayType";

export default function Map() {
    const position = useMemo(
        () => ({ lat: 24.137396608878987, lng: 120.68692065044608 }), // [緯度, 經度]
        []
    );
    const searchParams = useSearchParams();
    const bus = searchParams.get("bus") ?? "";
    const direction = searchParams.get("direction") ?? "";
    const station = searchParams.get("station") ?? "";
    const busShape = useAtomValue(busShapeAtom);
    const busStops = useAtomValue(busStopsAtom);
    const busOverlay = useAtomValue(overlayAtom);
    const cityRailwayOverlay = useAtomValue(cityRailwayOverlayAtom);
    const showCityOverlay = useAtomValue(showCityOverlayAtom);
    const showCityRailwayOverlay = useAtomValue(showCityRailwayOverlayAtom);

    const baselayers = [
        {
            name: "OpenStreetMap.Mapnik",
            value: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        {
            name: "OpenStreetMap.HOT",
            value: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        },
        {
            name: "OpenStreetMap.DE",
            value: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}}.png",
        },
        {
            name: "OpenStreetMap.CH",
            value: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
        },
        {
            name: "OpenStreetMap.France",
            value: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.}png",
        },
        {
            name: "OpenStreetMap.BZH",
            value: "https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png",
        },
        {
            name: "OpenTopoMap",
            value: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        },
    ];

    return (
        <MapContainer
            center={position}
            zoom={8}
            scrollWheelZoom={true}
            className="z-0 h-full w-full"
        >
            <LayersControl position="topright">
                {baselayers.map((item, index) => {
                    return (
                        <LayersControl.BaseLayer
                            checked={index === 0}
                            name={item.name}
                            key={item.name}
                        >
                            <TileLayer
                                url={item.value}
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                    );
                })}
            </LayersControl>
            <FlyToCurrent />
            <ShowPolyLines
                bus={bus}
                direction={direction}
                busShape={busShape}
                busStops={busStops}
            />
            <ShowStops
                bus={bus}
                direction={direction}
                busStops={busStops}
                station={station}
            />
            {showCityOverlay.map((c) => {
                return (
                    <Fragment key={`showCityOverlay ${c}`}>
                        <ShowOverlayPolylines
                            bus={bus}
                            direction={direction}
                            busOverlay={
                                busOverlay[c]?.filter((d) => d.ShowOverlay) ??
                                []
                            }
                        />
                        <ShowOverlayStops
                            busOverlay={
                                busOverlay[c]?.filter((d) => d.ShowOverlay) ??
                                []
                            }
                        />
                    </Fragment>
                );
            })}
            {showCityRailwayOverlay.map((c) => {
                return (
                    <Fragment key={`showCityRailway ${c}`}>
                        <ShowCityRailwayPolylines
                            c={c}
                            cityRailwayOverlay={cityRailwayOverlay[c]}
                        />
                        <ShowCityRailwayStations
                            cityRailwayStations={cityRailwayOverlay[c]}
                            c={c}
                        />
                    </Fragment>
                );
            })}
        </MapContainer>
    );
}

const FlyToCurrent = () => {
    const map = useMap();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                map.flyTo(
                    {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    13.5
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

const ShowPolyLines = ({
    bus,
    direction,
    busStops,
    busShape,
}: {
    bus: string;
    direction: string;
    busStops: BusStops[];
    busShape: BusGeo[];
}) => {
    const map = useMap();
    const getColor = useOverlayColor();
    useEffect(() => {
        if (busShape) {
            const positionStr = busShape[Number(direction)]?.Geometry;
            const positionArr = positionStr
                ? LinearToArray(positionStr)
                : undefined;
            if (positionArr) {
                const center = { lat: 0, lng: 0 } as {
                    lat: number;
                    lng: number;
                };
                positionArr.forEach((d, _i, arr) => {
                    center.lat += d[0] / arr.length;
                    center.lng += d[1] / arr.length;
                });
                map.flyTo(center, 13);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busShape]);

    if (!busShape || bus === "" || direction === "") {
        return "";
    }
    const positionStr =
        busShape[Number(direction)]?.Geometry ?? busShape[0]?.Geometry;
    if (positionStr) {
        const positionArr = LinearToArray(positionStr);
        const thisStops = busStops?.find(
            (item) =>
                item.Direction === Number(direction) &&
                item.RouteName.Zh_tw === bus
        )?.Stops;
        const color = getColor(bus);

        return (
            <>
                <ShowPolyline
                    positions={positionArr}
                    routeName={bus}
                    direction={direction}
                    pathOptions={{
                        opacity: 0.6,
                        color,
                        weight: 7,
                    }}
                    headSign={
                        thisStops
                            ? `${bus}（${thisStops[0].StopName.Zh_tw} - ${
                                  thisStops[thisStops.length - 1].StopName.Zh_tw
                              }）`
                            : bus
                    }
                />
            </>
        );
    }
    return "";
};
const ShowOverlayPolylines = ({
    bus,
    direction,
    busOverlay,
}: {
    bus: string;
    direction: string;
    busOverlay: BusOverlay[];
}) => {
    const getColor = useOverlayColor();
    return (
        <>
            {busOverlay.map((item) => {
                if (
                    item.Direction === Number(direction) &&
                    item.RouteName.Zh_tw === bus
                ) {
                    return null;
                }
                const positionArr = LinearToArray(item.Geometry);
                const headSign = `${item.RouteName.Zh_tw}（${
                    item.Stops[0].StopName.Zh_tw
                } - ${item.Stops[item.Stops.length - 1].StopName.Zh_tw}）`;
                const color = getColor(item.RouteName.Zh_tw);
                return (
                    <ShowPolyline
                        routeName={item.RouteName.Zh_tw}
                        direction={`${item.Direction}`}
                        key={`polyline ${item.RouteName.Zh_tw} ${item.Direction}`}
                        positions={positionArr}
                        pathOptions={{
                            opacity: 0.7,
                            color,
                            weight: 7,
                        }}
                        headSign={headSign}
                    />
                );
            })}
        </>
    );
};

const ShowOverlayStops = ({ busOverlay }: { busOverlay: BusOverlay[] }) => {
    const flatall = busOverlay
        .filter((d) => d.ShowOverlay)
        .map((d) => d.Stops)
        .flat();
    const flatName = flatall
        .map((d) => d.StopName.Zh_tw)
        .filter((item, index, arr) => arr.indexOf(item) === index);

    const flatNameWithRouteList = flatName.map((item) => {
        let countArr: string[] = [];
        busOverlay.forEach((d) => {
            d.Stops.forEach((data) => {
                if (data.StopName.Zh_tw === item) {
                    countArr = [...countArr, d.RouteName.Zh_tw];
                }
            });
        });
        return {
            name: item,
            passby: countArr,
        };
    });
    const getColor = useOverlayColor();
    return (
        <>
            {flatNameWithRouteList.map((data) => {
                const item = flatall.find(
                    (d) => d.StopName.Zh_tw === data.name
                );
                let h = "";
                data.passby.forEach((item, index, arr) => {
                    const color = getColor(item);
                    const { length } = arr;
                    if (index === 0) {
                        h = `<span style="display: block;border-radius: 100%;
                        background-color: white; width:  ${
                            1 / length
                        }rem; height: ${1 / length}rem;
                        position: relative; border: 0.25rem solid ${color};"></span>`;
                    } else if (index !== length - 1) {
                        h = `<span style="display: block;width:fit-content;
                        border-radius: 100%;border: ${
                            1.15 / length
                        }rem solid ${color};"
                        >${h}</span>`;
                    } else {
                        h = `<span style="display: block;width:fit-content;
                        border-radius: 100%;border: ${
                            1.15 / length
                        }rem solid ${color};
                        transform: translate(-50%, -50%);">${h}</span>`;
                    }
                });
                const icon = new DivIcon({
                    className: "my-custom-pin",
                    iconAnchor: [0, 0],
                    popupAnchor: [0, -12],
                    html: h,
                });
                return (
                    <>
                        {!!item && (
                            <ShowMarker
                                item={item}
                                currentStation=""
                                icon={icon}
                                tooltipDisplay={{
                                    display: false,
                                    text: data.name,
                                }}
                            />
                        )}
                    </>
                );
            })}
        </>
    );
};
const ShowStops = ({
    bus,
    direction,
    busStops,
    station,
}: {
    bus: string;
    direction: string;
    station: string;
    busStops: BusStops[];
}) => {
    if (!bus || direction === "") {
        return null;
    }

    if (busStops && bus && direction) {
        const thisDirection = busStops.find(
            (item) => item.Direction === Number(direction)
        );
        return (
            <>
                {thisDirection?.Stops.map((item) => {
                    return (
                        <ShowMarker
                            item={item}
                            key={`${item.StopSequence} ${item.StopName.Zh_tw}`}
                            currentStation={station}
                        />
                    );
                })}
            </>
        );
    }

    return null;
};

const ShowCityRailwayPolylines = ({
    cityRailwayOverlay,
    c,
}: {
    cityRailwayOverlay?: (CityRailwayGeo & {Stations: CityRailwayStation[]})[];
    c: string;
}) => {
    if (!cityRailwayOverlay) {
        return null;
    }
    return cityRailwayOverlay.map((item) => {
        const regex = /MULTILINESTRING/;
        const a = cityRailwayToColor[c];
        const color = (a ? a[item.LineID] : undefined) ?? "#000";
        const weight = 3;
        const opacity = 1;
        if (regex.test(item.Geometry)) {
            const positionArr = MultilinearToArray(item.Geometry);
            return positionArr.map((d, i) => {
                return (
                    <ShowPolyline
                        routeName={item.LineName.Zh_tw}
                        key={`cityRailway polylines ${i} ${item.LineName}`}
                        positions={d}
                        pathOptions={{
                            opacity,
                            color,
                            weight,
                        }}
                        headSign={item.LineName.Zh_tw}
                    />
                );
            });
        }
        const positionArr = LinearToArray(item.Geometry);
        return (
            <ShowPolyline
                routeName={item.LineName.Zh_tw}
                key={`cityRailway ${item.LineName.Zh_tw}`}
                positions={positionArr}
                pathOptions={{
                    opacity,
                    color,
                    weight,
                }}
                headSign={item.LineName.Zh_tw}
            />
        );
    });
};
const ShowCityRailwayStations = ({
    cityRailwayStations,
    c,
}: {
    cityRailwayStations?: (CityRailwayGeo & {Stations: CityRailwayStation[]})[];
    c: string;
}) => {
    if (!cityRailwayStations) {
        return null;
    }
    const flatStations = cityRailwayStations.map(d => d.Stations).flat()
    const allStationName = flatStations
        .map((item) => {
            return item.StationName.Zh_tw;
        })
        .filter((d, i, arr) => {
            if (arr.indexOf(d) === i) {
                return true;
            }
            return false;
        });
    return allStationName.map((item) => {
        let IDs = [] as string[];
        flatStations.forEach((d) => {
            if (d.StationName.Zh_tw === item) {
                IDs = [...IDs, d.StationID];
            }
        });
        const thisData = flatStations.find(
            (d) => d.StationName.Zh_tw === item
        );
        if (!thisData) {
            return null;
        }
        const a = cityRailwayToColor[c] ?? {};
        const colors = IDs.map((d) => {
            let itm = { color: "", name: "" };
            Object.keys(a ?? {})
                .sort((a, b) => -a.length + b.length)
                .some((data) => {
                    if (d.includes(data) && a[data]) {
                        itm.color = a[data];
                        itm.name = d;
                        return true;
                    }
                    return false;
                });
            return itm;
        }).filter((d) => d.name);
        if (c === "tc" && colors.length === 0) {
            colors.unshift({
                color: cityRailwayToColor?.tc?.G ?? "",
                name: "G",
            });
        }
        let h = "";
        colors.forEach((color) => {
            h += `<span style="display: block;border-radius: 0.25rem;
        background-color: white; width: 1rem; height: 1rem;
        position: relative; border: 0.25rem solid ${color.color}; flex-shrink: 0"></span>`;
        });
        h = `<div style="display: flex;width: fit-content; transform: translate(-50%, -50%);">${h}</div>`;
        const icon = new DivIcon({
            className: "city-railway-icon",
            iconAnchor: [0, 0],
            popupAnchor: [0, -12],
            html: h,
        });
        return (
            <Marker
                icon={icon}
                position={[
                    thisData.StationPosition.PositionLat,
                    thisData.StationPosition.PositionLon,
                ]}
                key={`city railway station ${thisData.StationName.Zh_tw}`}
            >
                <Popup>
                    <div className="flex gap-2 items-center h-6">
                        <p className="py-0">{`${thisData.StationName.Zh_tw}`}</p>
                        <p className="flex gap-1 items-center py-0">
                            {colors.map((item) => {
                                return (
                                    <span
                                        key={`${thisData.StationName.Zh_tw} ${item.name}`}
                                        className="text-white p-1 rounded-md px-2 text-xs font-bold"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.name}
                                    </span>
                                );
                            })}
                        </p>
                    </div>
                </Popup>
                <Tooltip direction="bottom">
                    <div>
                        <p>{`${thisData.StationName.Zh_tw}`}</p>
                    </div>
                </Tooltip>
            </Marker>
        );
    });
};
