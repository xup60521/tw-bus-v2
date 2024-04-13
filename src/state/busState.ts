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

const OVERLAY_ATOM_KEY = "overlay";
const RAILWAY_OVERLAY_KEY = "railway_overlay";

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

export interface OverlayState {
    busOverlay: { [key: string]: BusOverlay[] | undefined };
    load_localStorage: () => void;
    show_CityOverlay: (c: string[]) => void;
    hide_CityOverlay: (c: string[]) => void;
    toggle_CityOverlay: (
        c: string,
        bus: string,
        direction: string,
        checked: boolean
    ) => void;
    removeOverlay: (c: string, bus: string, direction: string) => void;
    addOverlay: (c: string, data: BusOverlay) => void;
}

export const useOverlayStore = create<OverlayState>((set, get) => ({
    busOverlay: {},
    load_localStorage: () => {
        set({
            busOverlay: JSON.parse(
                localStorage.getItem(OVERLAY_ATOM_KEY) ?? "{}"
            ) as { [key: string]: BusOverlay[] | undefined },
        });
    },
    show_CityOverlay: (cities: string[]) => {
        set((state) => {
            const prev = state.busOverlay;
            cities.forEach((c) => {
                const newArr = prev[c]?.map((d) => {
                    d.ShowOverlay = true;
                    return d;
                });
                if (!newArr) {
                    return { ...prev };
                }
                prev[c] = newArr;
            });
            localStorage.setItem(
                OVERLAY_ATOM_KEY,
                JSON.stringify(prev)
            );
            return { busOverlay: prev };
        });
    },
    hide_CityOverlay: (cities: string[]) => {
        set((state) => {
            const prev = state.busOverlay;
            cities.forEach((c) => {
                const newArr = prev[c]?.map((d) => {
                    d.ShowOverlay = false;
                    return d;
                });
                if (!newArr) {
                    return { ...prev };
                }
                prev[c] = newArr;
            });
            localStorage.setItem(
                OVERLAY_ATOM_KEY,
                JSON.stringify(prev)
            );
            return { busOverlay: prev };
        });
    },
    toggle_CityOverlay(c, bus, direction, checked) {
        set((state) => {
            const prev = state.busOverlay;
            const newArr = prev[c]?.map((d) => {
                if (
                    d.RouteName.Zh_tw === bus &&
                    d.Direction === Number(direction)
                ) {
                    d.ShowOverlay = checked;
                    return d;
                }
                return d;
            });
            if (!newArr) {
                return { ...prev };
            }
            prev[c] = newArr;
            localStorage.setItem(
                OVERLAY_ATOM_KEY,
                JSON.stringify(prev)
            );
            return { busOverlay: prev };
        });
    },
    removeOverlay: (city: string, bus: string, direction: string) => {
        set((state) => {
            const prev = state.busOverlay;
            const filtered =
                prev[city]?.filter(
                    (item) =>
                        item.RouteName.Zh_tw !== bus ||
                        item.Direction !== Number(direction)
                ) ?? [];
            prev[city] = filtered;
            localStorage.setItem(
                OVERLAY_ATOM_KEY,
                JSON.stringify(prev)
            );
            return { busOverlay: prev };
        });
    },
    addOverlay: (city: string, data: BusOverlay) => {
        set((state) => {
            const prev = state.busOverlay;
            prev[city] = [...(prev[city] ?? []), data];
            localStorage.setItem(
                OVERLAY_ATOM_KEY,
                JSON.stringify(prev)
            );
            return {
                busOverlay: prev,
            };
        });
    },
}));

export const cityRailwayOverlayAtom = atomWithStorage<{
    [key: string]: CityRailwayOverlay[] | undefined;
}>(RAILWAY_OVERLAY_KEY, {});

export const showCityOverlayAtom = atom<string[]>([]);
export const showCityRailwayOverlayAtom = atom<string[]>([]);

export const planStartStationAtom = atom("");
export const planEndStationAtom = atom("");
export const planResultAtom = atom<SearchBus[] | null>(null);
