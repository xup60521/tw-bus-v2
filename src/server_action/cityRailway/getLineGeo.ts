"use server";

import { cityRailwayGeo } from "@/lib/LineData";
import type {
    CityRailwayGeo,
    CityRailwayOverlay,
    CityRailwayStation,
} from "@/type/cityRailwayType";

export async function getLineGeo(systemList: string[]) {
    const data = {} as {
        [key: string]: CityRailwayOverlay[]
    };
    systemList.forEach((d) => {
        data[d] = cityRailwayGeo[d].map(item => ({...item, ShowOverlay: true}));
    });
    return data;
}
