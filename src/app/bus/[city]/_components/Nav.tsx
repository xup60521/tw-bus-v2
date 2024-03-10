"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  type ReadonlyURLSearchParams,
  useSearchParams,
  useRouter,
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
import { pageAtom } from "@/state/busState";
import { useAtom, useAtomValue } from "jotai";

export default function Nav({ city }: { city: string }) {
  const searchParams = useSearchParams();
  useHydrateAtoms([[pageAtom, searchParams.get("page") ?? "bus"]]);
  const page = useAtomValue(pageAtom);
  const [initBusList, setInitBusList] = useState<BusList[]>([]);
  useEffect(() => {
    getAllBus(city).then((res: BusList[]) => {
      setInitBusList([...res]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ReactQuery>
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
      <Controller searchParams={searchParams} />
    </ReactQuery>
  );
}

const Controller = ({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) => {
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
