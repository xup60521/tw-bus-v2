import type { BusGeo, BusOverlay, BusStops } from "@/type/busType";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
export const overlayAtom = atomWithStorage<{
  [key:string]: BusOverlay[] | undefined;
}>("overlay",{
  "Taipei": [],
  "NewTaipei": [],
  "Taoyuan": [],
  "Taichung": [],
  "Tainan": [],
  "Kaohsiung": [],
  "Keelung": [],
  "KinmenCounty": [],
  "Hsinchu": [],
  "HsinchuCounty": [],
  "MiaoliCounty": [],
  "ChanghuaCounty": [],
  "NantouCounty": [],
  "YunlinCounty": [],
  "ChiayiCounty": [],
  "Chiayi": [],
  "PingtungCounty": [],
  "YilanCounty": [],
  "HualienCounty": [],
  "TaitungCounty": [],
  "PenghuCounty": [],
});
export const noteAtom = atomWithStorage("note", "");
export const pageAtom = atom("");
