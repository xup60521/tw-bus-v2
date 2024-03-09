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

export default function Nav({
  city,
  initBusList,
}: {
  city: string;
  initBusList: BusList[];
}) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "bus";
  return (
    <ReactQuery>
      {page === "bus" && <Bus city={city} initBusList={initBusList} />}
      {page === "station" && <Station city={city} />}
      {page === "note" && <Note />}
      {page === "overlay" && <Overlay />}
      <Controller searchParams={searchParams} />
    </ReactQuery>
  );
}

const Controller = ({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) => {
  const page = searchParams.get("page") ?? "bus";
  const setURLSearchParams = useSetURLSearchParams();

  return (
    <div className="absolute left-[50vw] top-2 box-border flex h-8 -translate-x-[50%] rounded-xl bg-white text-sm text-black md:top-[calc(100vh-2.5rem)] z-10">
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => setURLSearchParams([{ key: "page", value: "bus" }])}
      >
        公車
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => setURLSearchParams([{ key: "page", value: "station" }])}
      >
        站牌
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => setURLSearchParams([{ key: "page", value: "note" }])}
      >
        筆記
      </button>
      <button
        className="z-20 h-8 w-12 text-center font-bold"
        onClick={() => setURLSearchParams([{ key: "page", value: "overlay" }])}
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
