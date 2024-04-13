import { getBusShape } from "@/server_action/getBusShape";
import { getBusStops } from "@/server_action/getBusStops";
import type { BusGeo, BusOverlay, BusStops, SearchBus } from "@/type/busType";
import type {
    CityRailwayGeo,
    CityRailwayOverlay,
    CityRailwayStation,
} from "@/type/cityRailwayType";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { create } from "zustand";

export const pageAtom = atom("");

export interface BusStopsGeoState {
    busStops: BusStops[];
    busShape: BusGeo[];
    fetchStopsGeoData: (bus: string, city: string) => void;
}

export const useBusStopsGeoStore = create<BusStopsGeoState>((set) => ({
    busStops: [],
    busShape: [],
    fetchStopsGeoData: async (bus, city) => {
        const busStops = await getBusStops(bus, city);
        const busShape = await getBusShape(bus, city);
        set({
            busStops,
            busShape,
        });
    },
}));

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
    [key: string]: CityRailwayOverlay[] | undefined;
}>("railway_overlay", {});
export const showCityOverlayAtom = atom<string[]>([]);
export const showCityRailwayOverlayAtom = atom<string[]>([]);

export const planStartStationAtom = atom("");
export const planEndStationAtom = atom("");
export const planResultAtom = atom<SearchBus[] | null>(null);
