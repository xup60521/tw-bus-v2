export type CityRailwayGeo = {
    LineNo: string;
    LineID: string;
    LineName: Name;
    UpdateTime: string;
    Geometry: string;
    EncodedPolyline?: string;
    ShowOverlay?: boolean;
};

type Name = {
    Zh_tw: string;
    En?: string;
};

export type CityRailwayStation = {
    StationID: string;
    StationName: Name;
    BikeAllowOnHoliday: boolean;
    SrcUpdateTime: string;
    UpdateTime: string;
    VersionID: number;
    StationPosition: Position;
};

type Position = {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
};
