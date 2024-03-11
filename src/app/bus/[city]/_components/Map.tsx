"use client";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import seedrandom from "seedrandom"
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "next/navigation";
import { getBusStops } from "@/server_action/getBusStops";
import { useAtom, useAtomValue } from "jotai";
import { busShapeAtom, busStopsAtom, overlayAtom } from "@/state/busState";
import { getBusShape } from "@/server_action/getBusShape";
import type { BusGeo, BusOverlay, BusStops } from "@/type/busType";
import ShowMarker from "./ShowMarker";
import ShowPolyline from "./ShowPolyline";
import { Icon } from "leaflet";

export default function Map({ city }: { city: string }) {
  const position = useMemo(
    () => ({ lat: 24.137396608878987, lng: 120.68692065044608 }), // [緯度, 經度]
    []
  );
  const searchParams = useSearchParams();
  const bus = searchParams.get("bus") ?? ""
  const direction = searchParams.get("direction") ?? ""
  const station = searchParams.get("station") ?? ""
  const busShape = useAtomValue(busShapeAtom);
  const busStops = useAtomValue(busStopsAtom);
  const busOverlay = useAtomValue(overlayAtom)

  
  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <FlyToCurrent />
        <ShowPolyLines 
      bus={bus} 
      direction={direction} 
      busShape={busShape} 
      busStops={busStops} 
      /> 
      <ShowOverlayPolylines 
      bus={bus} 
      direction={direction} 
      busOverlay={busOverlay} 
      /> 
      <ShowStops bus={bus} direction={direction} busStops={busStops} station={station} /> 
    <ShowOverlayStops busOverlay={busOverlay} /> 
      </MapContainer>
    </>
  );
}

const FlyToCurrent = () => {
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.flyTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
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

  useEffect(() => {
    if (busShape) {
      const positionStr = busShape[Number(direction)]?.Geometry;
      const regex = /[A-Z()]/g;
      const positionArr = positionStr
        ?.replace(regex, "")
        .split(",")
        .map((f) =>
          f
            .split(" ")
            .reverse()
            .map((item) => Number(item))
        ) as [number, number][];
      if (positionArr) {
        const center = { lat: 0, lng: 0 } as { lat: number; lng: number };
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
    const regex = /[A-Z()]/g;
    const positionArr = positionStr
      .replace(regex, "")
      .split(",")
      .map((f) =>
        f
          .split(" ")
          .reverse()
          .map((item) => Number(item))
      ) as [number, number][];
    const thisStops = busStops?.find(
      (item) =>
        item.Direction === Number(direction) && item.RouteName.Zh_tw === bus
    )?.Stops;

    return (
      <>
        <ShowPolyline
          positions={positionArr}
          routeName={bus}
          direction={direction}
          pathOptions={{
            opacity: 0.6,
            color: "#809fff",
            weight: 8,
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
  return (
    <>
      {busOverlay.map((item) => {
        if (
          item.Direction === Number(direction) &&
          item.RouteName.Zh_tw === bus
        ) {
          return null;
        }
        const regex = /[A-Z()]/g;
        const positionArr = item.Geometry.replace(regex, "")
          .split(",")
          .map((f) =>
            f
              .split(" ")
              .reverse()
              .map((item) => Number(item))
          ) as [number, number][];
        const headSign = `${item.RouteName.Zh_tw}（${
          item.Stops[0].StopName.Zh_tw
        } - ${item.Stops[item.Stops.length - 1].StopName.Zh_tw}）`;
        const color_r = Math.floor(
          256 * seedrandom(item.RouteName.Zh_tw + "r")()
        )
          .toString(16)
          .padStart(2, "0");
        const color_g = Math.floor(
          256 * seedrandom(item.RouteName.Zh_tw + "g")()
        )
          .toString(16)
          .padStart(2, "0");
        const color_b = Math.floor(
          256 * seedrandom(item.RouteName.Zh_tw + "b")()
        )
          .toString(16)
          .padStart(2, "0");
        const color = `#${color_r}${color_g}${color_b}`;
        return (
          <ShowPolyline
            routeName={item.RouteName.Zh_tw}
            direction={`${item.Direction}`}
            key={`polyline ${item.RouteName.Zh_tw} ${item.Direction}`}
            positions={positionArr}
            pathOptions={{
              opacity: 0.7,
              color,
              weight: 8,
            }}
            headSign={headSign}
          />
        );
      })}
    </>
  );
};
const ShowOverlayStops = ({ busOverlay }: { busOverlay: BusOverlay[] }) => {
  const ref = useRef<L.Marker>(null);
  const flatall = busOverlay.map((d) => d.Stops).flat();
  const flatName = flatall
    .map((d) => d.StopName.Zh_tw)
    .filter((item, index, arr) => arr.indexOf(item) === index);
  // const filteredOverlap = flatName.filter(name => !busStopFlat?.find(item => item === name))
  const icon = new Icon({
    iconUrl: "/pin3.png",
    iconSize: [16, 16],
  });

  return (
    <>
      {flatName.map((name) => {
        const item = flatall.find((d) => d.StopName.Zh_tw === name);
        return (
          <>
            {!!item && (
              <Marker
                ref={ref}
                riseOffset={-12}
                icon={icon}
                key={`${item.StopSequence}`}
                position={[
                  item.StopPosition.PositionLat,
                  item.StopPosition.PositionLon,
                ]}
              >
                <Popup>
                  <div>
                    <p>{`${item.StopName.Zh_tw}`}</p>
                  </div>
                </Popup>
                <Tooltip direction="bottom">
                  <div>
                    <p>{`${item.StopName.Zh_tw}`}</p>
                  </div>
                </Tooltip>
              </Marker>
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
  station
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
              station={station}
            />
          );
        })}
      </>
    );
  }

  return null;
};