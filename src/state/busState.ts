import type { BusGeo, BusOverlay, BusStops } from "@/type/busType";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export const busStopsAtom = atom<BusStops[]>([]);
export const busShapeAtom = atom<BusGeo[]>([]);
export const toggleStopAtom = atom<{
    stopName?: string;
    id: number;
  }>({ stopName: undefined, id: 0 });
  export const togglePolylineAtom = atom<{
    routeName?: string;
    direction?: string;
    id: number;
  }>({ routeName: undefined, id: 0, direction: undefined });
  export const overlayAtom = atom<BusOverlay[]>([]);
  export const noteAtom = atomWithStorage("note", "")
  export const pageAtom = atom("")