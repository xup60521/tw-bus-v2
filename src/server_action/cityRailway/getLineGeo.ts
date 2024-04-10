"use server";

import { cityRailwayGeo, cityRailwayStation } from "@/lib/LineData";
import type {
    CityRailwayGeo,
    CityRailwayStation,
} from "@/type/cityRailwayType";

export async function getLineGeo(systemList: string[]) {
    const data = {} as {
        [key: string]: {
            geo: CityRailwayGeo[];
            stations: CityRailwayStation[];
        };
    };
    systemList.forEach((d) => {
        data[d] = { geo: cityRailwayGeo[d], stations: cityRailwayStation[d] };
    });
    return data;
}
