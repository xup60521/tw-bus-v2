import type { BusGeo, BusOverlay, BusStops, SearchBus } from "@/type/busType";
import type { CityRailwayGeo } from "@/type/cityRailwayType";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const pageAtom = atom("");
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
    [key: string]: BusOverlay[] | undefined;
}>("overlay", {
    Taipei: [],
    NewTaipei: [],
    Taoyuan: [],
    Taichung: [],
    Tainan: [],
    Kaohsiung: [],
    Keelung: [],
    KinmenCounty: [],
    Hsinchu: [],
    HsinchuCounty: [],
    MiaoliCounty: [],
    ChanghuaCounty: [],
    NantouCounty: [],
    YunlinCounty: [],
    ChiayiCounty: [],
    Chiayi: [],
    PingtungCounty: [],
    YilanCounty: [],
    HualienCounty: [],
    TaitungCounty: [],
    PenghuCounty: [],
});
export const cityRailwayOverlayAtom = atomWithStorage<{
    [key: string]: CityRailwayGeo[] | undefined
}>("CityRailwayOverlay", {})
export const showCityOverlayAtom = atom<string[]>([]);
export const showCityRailwayOverlayAtom = atom<string[]>([]);

export const planStartStationAtom = atom("");
export const planEndStationAtom = atom("");
export const planResultAtom = atom<SearchBus[] | null>(null);
