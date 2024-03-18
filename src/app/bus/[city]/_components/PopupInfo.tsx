import { dayOfAWeek } from "@/lib/utils";
import { getBusSchedule } from "@/server_action/getBusSchedule";
import type { BusSchedule } from "@/type/busType";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoIosCalendar, IoIosClose } from "react-icons/io";
import Popup from "reactjs-popup";

const PopupInfo = ({
    openPopup,
    setOpenPopup,
    bus,
    city,
}: {
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
    bus: string;
    city: string;
}) => {
    const [day, setDay] = useState(new Date().getDay());
    const currentDayRef = useRef(new Date().getDay());
    const [busSchedule, setBusSchedule] = useState<BusSchedule[]>([]);
    const changeDay = (direction: string) => {
        if (direction === "left") {
            setDay(day === 0 ? 6 : day - 1);
        }
        if (direction === "right") {
            setDay(day === 6 ? 0 : day + 1);
        }
    };
    useEffect(() => {
        if (openPopup) {
            getBusSchedule(city, bus).then((res) => setBusSchedule([...res]));
        }
    }, [openPopup, bus]);

    const hasFrequency = !!busSchedule.find((d) => !!d.Frequencys);
    const hasTimeTable = !!busSchedule.find((d) => !!d.Timetables);

    return (
        <Popup open={openPopup} onClose={() => setOpenPopup(false)}>
            <div className="w-[90vw] max-w-[50rem] h-[90vh] max-h-[50rem] rounded-lg flex bg-slate-800 flex-col text-white">
                <div className="flex p-2 rounded-t-lg justify-between items-center">
                    <h3 className=" bg-transparent text-white py-1 flex-shrink-0 px-3 border-[1px] border-white rounded-md">
                        {bus}
                    </h3>
                    <button
                        onClick={() => {
                            setOpenPopup(false);
                        }}
                        className=" transition-all size-9 rounded-md hover:bg-white hover:text-black flex justify-center items-center text-3xl"
                    >
                        <IoIosClose />
                    </button>
                </div>
                <button
                    onClick={() =>
                        navigator.clipboard.writeText(
                            JSON.stringify(busSchedule)
                        )
                    }
                >
                    copy
                </button>
                <div className="w-full min-h-0 flex flex-col p-2">
                    <div className="w-full flex justify-between">
                        <button
                            onClick={() => changeDay("left")}
                            className="px-3 py-1 rounded-md border-[1px] border-white transition-all hover:bg-white hover:text-black"
                        >
                            <FaArrowLeft />
                        </button>
                        <div className="flex h-full items-center gap-2">
                            <span className="font-mono">{dayOfAWeek[day]}</span>
                            {day !== currentDayRef.current && (
                                <button
                                    className="rounded-md transition-all hover:bg-white hover:text-black p-1"
                                    onClick={() =>
                                        setDay(currentDayRef.current)
                                    }
                                >
                                    <IoIosCalendar />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => changeDay("right")}
                            className="px-3 py-1 rounded-md border-[1px] border-white transition-all hover:bg-white hover:text-black"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                <div className="flex-grow min-h-0 w-full flex flex-col px-2">
                    {hasFrequency && (
                        <div className="flex flex-col gap-2">
                            <p className="font-mono w-full p-1 border-b-[1px] border-white">
                                Frequency
                            </p>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <div className="flex flex-col min-h-0">
                                    {busSchedule
                                        .find(
                                            (d) =>
                                                d.RouteName.Zh_tw === bus &&
                                                d.Direction === 0
                                        )
                                        ?.Frequencys?.filter(
                                            (d) =>
                                                d.ServiceDay[
                                                    dayOfAWeek[day]
                                                ] === 1
                                        )
                                        ?.map((item, index) => {
                                            return (
                                                <div key={`0 ${index}`}>
                                                    <span>{`${item.StartTime} ~ ${item.EndTime}`}</span>
                                                    <span>{`最長班距：${item.MaxHeadwayMins}；最短班距：${item.MinHeadwayMins}`}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="flex flex-col min-h-0">
                                    {busSchedule
                                        .find((d) => d.Direction === 1)
                                        ?.Frequencys?.filter(
                                            (d) =>
                                                d.ServiceDay[
                                                    dayOfAWeek[day]
                                                ] === 1
                                        )
                                        ?.map((item, index) => {
                                            return (
                                                <div key={`1 ${index}`}>
                                                    <span>{`${item.StartTime} ~ ${item.EndTime}`}</span>
                                                    <span>{`最長班距：${item.MaxHeadwayMins}；最短班距：${item.MinHeadwayMins}`}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="flex flex-col min-h-0"></div>
                            </div>
                        </div>
                    )}
                    {hasTimeTable && (
                        <div className="flex flex-col gap-2">
                            <p className="font-mono w-full p-1 border-b-[1px] border-white">
                                Time Table
                            </p>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <div className="flex flex-col min-h-0">
                                    {busSchedule.find(d => d.Direction === 0)?.Timetables?.filter(d => d.ServiceDay[dayOfAWeek[day]] === 1)?.map((item, index) => {
                                        return (
                                            <div key={`0 timetable ${index}`}>
                                                <span>{item.StopTimes[0].DepartureTime}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Popup>
    );
};

export default PopupInfo;
