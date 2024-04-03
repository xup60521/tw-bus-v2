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
