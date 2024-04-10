"use server";

import { cityRailwayGeo } from "@/lib/LineData";
import type {
    CityRailwayGeo,
    CityRailwayStation,
} from "@/type/cityRailwayType";

export async function getLineGeo(systemList: string[]) {
    const data = {} as {
        [key: string]: (CityRailwayGeo & {Stations: CityRailwayStation[]})[]
    };
    systemList.forEach((d) => {
        data[d] = cityRailwayGeo[d];
    });
    return data;
}
