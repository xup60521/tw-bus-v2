export type BusList = {
  HasSubRoutes: boolean;
  SubRoutes: [SubRoute, ...SubRoute[]];
  BusRouteType: number;
  RouteName: Name;
  UpdateTime: string;
  VersionID: number;
};

type SubRoute = {
  SubRouteUID: string;
  SubRouteID: string;
  OperatorIDs: string[];
  SubRouteName: Name;
  Headsign?: string;
  HeadsignEn?: string;
  Direction: number;
  FirstBusTime?: string;
  LastBusTime?: string;
  HolidayFirstBusTime?: string;
  HolidayLastBusTime?: string;
};

export type Name = {
  Zh_tw: string;
  En?: string;
};

export type BusEst = {
  StopName: Name;
  RouteName: Name;
  Direction: number;
  EstimateTime?: number;
  StopSequence: number;
  StopStatus: number;
  NextBusTime?: string;
  SrcUpdateTime?: string;
  UpdateTime: string;
};

//車輛狀態備註 : [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運']

export type BusGeo = {
  RouteName: Name;
  Direction: number;
  Geometry: string;
  EncodedPolyline: string;
  UpdateTime: string;
  VersionID: number;
};

export type BusStops = {
  RouteName: Name;
  Direction: number;
  Stops: Stop[];
  UpdateTime: string;
  SubRouteName?: Name;
  VersionID: number;
};

type Stop = {
  StopUID: string;
  StopID: string;
  StopName: Name;
  StopBoarding: number;
  StopSequence: number;
  StopPosition: StopPosition;
  StationID: string;
  StationGroupID: string;
  LocationCityCode: string;
};

type StopPosition = {
  PositionLon: number;
  PositionLat: number;
  GeoHash: string;
};

export type BusRoutePassBy = {
  RouteName: Name;
  Direction: number;
  EstimateTime?: number;
  StopSequence: number;
  StopStatus: number;
  NextBusTime?: string;
  SrcUpdateTime: string;
  UpdateTime: string;
};

export type BusStopSearchResult = {
  StopName: Name;
  UpdateTime: string;
  VersionID: number;
  StopPosition: StopPosition;
};

export type BusOverlay = BusGeo & {
  Stops: BusStops["Stops"];
  ShowOverlay: boolean;
};

export type BusSchedule = {
    RouteName:   Name;
    Direction:   number;
    Frequencys?: Frequency[];
    UpdateTime:  string;
    VersionID:   number;
    Timetables?: Timetable[];
}

type Frequency = {
    StartTime:      string;
    EndTime:        string;
    MinHeadwayMins: number;
    MaxHeadwayMins: number;
    ServiceDay:     ServiceDay;
}

type ServiceDay = {
    Sunday:    number;
    Monday:    number;
    Tuesday:   number;
    Wednesday: number;
    Thursday:  number;
    Friday:    number;
    Saturday:  number;
    [key:string]: number | undefined;
}


type Timetable = {
    TripID:     string;
    ServiceDay: ServiceDay;
    StopTimes:  StopTime[];
}

type StopTime = {
    StopSequence:  number;
    StopUID:       string;
    StopID:        string;
    StopName:      Name;
    ArrivalTime:   string;
    DepartureTime: string;
}

export type SearchBus = {
    RouteName:  Name;
    Direction:  number;
    UpdateTime: string;
    VersionID:  number;
}