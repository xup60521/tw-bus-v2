export type InterCityBusListType = {
    HasSubRoutes: boolean;
    Operators: Operator[];
    SubRoutes: SubRoute[];
    BusRouteType: number;
    RouteName: Name;
    DepartureStopNameZh: string;
    DestinationStopNameZh: string;
    RouteMapImageUrl: string;
    UpdateTime: string;
    VersionID: number;
};

type Operator = {
    OperatorID: string;
    OperatorName: Name;
    OperatorCode: string;
    OperatorNo: string;
};

type Name = {
    Zh_tw: string;
    En?: string;
};

type SubRoute = {
    SubRouteUID: string;
    SubRouteID: string;
    OperatorIDs: string[];
    SubRouteName: Name;
    Headsign: string;
    HeadsignEn: string;
    Direction: number;
};

export type InterCityBusScheduleType = {
    RouteName: Name;
    Direction: number;
    Timetables?: Timetable[];
    UpdateTime: string;
    VersionID: number;
};

type Timetable = {
    TripID: string;
    IsLowFloor?: boolean;
    ServiceDay: ServiceDay;
    StopTimes: StopTime[];
};

type ServiceDay = {
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    [key: string]: number | undefined;
};

type StopTime = {
    StopSequence: number;
    StopUID: string;
    StopID: string;
    StopName: Name;
    ArrivalTime: string;
    DepartureTime: string;
};

export type InterCityBusStopsType = {
    RouteName:    Name;
    SubRouteName: Name;
    Direction:    number;
    Stops:        Stop[];
    UpdateTime:   string;
    VersionID:    number;
}

type Stop = {
    StopUID:          string;
    StopID:           string;
    StopName:         Name;
    StopBoarding:     number;
    StopSequence:     number;
    StopPosition:     StopPosition;
    StationID:        string;
    StationGroupID:   string;
    LocationCityCode: string;
}

type StopPosition = {
    PositionLon: number;
    PositionLat: number;
    GeoHash:     string;
}

export type InterCityBusShapeType = {
    RouteName:       Name;
    SubRouteName:    Name;
    Direction:       number;
    Geometry:        string;
    EncodedPolyline: string;
    UpdateTime:      string;
    VersionID:       number;
}

export type InterCityBusEstType = {
    StopName:      Name;
    RouteName:     Name;
    SubRouteName:  Name;
    Direction:     number;
    EstimateTime?: number;
    NextBusTime?: string;
    StopCountDown: number;
    StopSequence:  number;
    StopStatus:    number;
    MessageType:   number;
    IsLastBus:     boolean;
    DataTime:      string;
    SrcTransTime:  string;
    UpdateTime:    string;
}

export type InterCitySearchBus = {
    RouteName:    Name;
    SubRouteName: Name;
    Direction:    number;
    UpdateTime:   string;
    VersionID:    number;
}