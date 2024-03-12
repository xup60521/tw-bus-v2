import type { BusGeo, BusStops } from "@/type/busType";
import { atom } from "jotai";

export const route_busAtom = atom("")
export const route_directionAtom = atom("")
export const route_busShapeAtom = atom<BusGeo[]>([])
export const route_busStopsAtom = atom<BusStops[]>([])