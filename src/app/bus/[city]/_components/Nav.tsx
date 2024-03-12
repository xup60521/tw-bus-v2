"use client";

import {
  useSearchParams,
} from "next/navigation";
import Bus from "./Bus";
import Station from "./Station";
import Note from "./Note";
import Overlay from "./Overlay";
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
import { LinearToArray } from "@/lib/utils";

export default function Nav({ city, initBusList }: { city: string, initBusList: BusList[] }) {
  const searchParams = useSearchParams();
  useHydrateAtoms([[pageAtom, searchParams.get("page") ?? "bus"]]);
  const page = useAtomValue(pageAtom);
  const setBusShape = useSetAtom(busShapeAtom)
  const setBusStops = useSetAtom(busStopsAtom)
  const bus = searchParams.get("bus") ?? ""
  
  
  
  useEffect(() => {
    if (bus) {
      getBusStops(bus, city)
        .then((stops) => {
          setBusStops([...stops]);
          getBusShape(bus, city)
            .then((shapes) => {
              const withDirectionData = shapes
                .map((item, index, arr) => {
                  const d0 = stops
                    .find((d) => d.Direction === 0 && d.RouteName.Zh_tw === bus)
                    ?.Stops.sort(
                      (a, b) => a.StopSequence - b.StopSequence
                    )[0].StopPosition;
                  const d1 = stops
                    .find((d) => d.Direction === 1 && d.RouteName.Zh_tw === bus)
                    ?.Stops.sort(
                      (a, b) => a.StopSequence - b.StopSequence
                    )[0].StopPosition;
                  if (item.Direction) {
                    return item;
                  } else if (arr.length === 2 && d0 && d1) {
                    const position = LinearToArray(item.Geometry)[0] as [number, number];
                    const length_to_d0 =
                      (position[0] - d0.PositionLat) ** 2 +
                      (position[1] - d0.PositionLon) ** 2;
                    const length_to_d1 =
                      (position[0] - d1.PositionLat) ** 2 +
                      (position[1] - d1.PositionLon) ** 2;
                    if (length_to_d0 >= length_to_d1) {
                      item.Direction = 1;
                    } else {
                      item.Direction = 0;
                    }

                    return item;
                  } else {
                    item.Direction = index;
                    return item;
                  }
                })
                .sort((a, b) => a.Direction - b.Direction);
              setBusShape([...withDirectionData]);
            })
            .catch((shapErr) => alert(shapErr));
        })
        .catch((StopsErr) => alert(StopsErr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bus]);
  return (
    <>
      {(() => {
        if (page === "station") {
          return <Station city={city} />;
        }
        if (page === "note") {
          return <Note />;
        }
        if (page === "overlay") {
          return <Overlay />;
        }
        return <Bus city={city} initBusList={initBusList} />;
      })()}
      <Controller />
    </>
  );
}

const Controller = () => {
  const [page, setPage] = useAtom(pageAtom)
  const setURLSearchParams = useSetURLSearchParams();

  return (
    <div className="absolute left-[50vw] top-2 box-border flex h-8 -translate-x-[50%] rounded-xl bg-white text-sm text-black md:top-[calc(100vh-2.5rem)] z-10">
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => {
          setPage("bus")
          setURLSearchParams([{ key: "page", value: "bus" }]);
        }}
      >
        公車
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => {
          setPage("station")
          setURLSearchParams([{ key: "page", value: "station" }]);
        }}
      >
        站牌
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => {
          setPage("note")
          setURLSearchParams([{ key: "page", value: "note" }]);
        }}
      >
        筆記
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => {
          setPage("overlay")
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
          : `${
              page === "note"
                ? "translate-x-[200%]"
                : `${page === "overlay" ? "translate-x-[300%]" : ""}`
            }`
      }`}
      />
    </div>
  );
};
