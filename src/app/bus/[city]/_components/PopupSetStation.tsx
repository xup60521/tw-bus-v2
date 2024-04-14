import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchStop } from "@/server_action/searchStop";
import { BusStopSearchResult } from "@/type/busType";
import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import Popup from "reactjs-popup";
import { geocoders } from "leaflet-control-geocoder";
import Geohash from "latlon-geohash";
// import { useToast } from "@/components/ui/use-toast";

export default function PopupSetStation({
    open,
    setOpen,
    city,
    setStation,
    setGeoHash,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    city: string;
    setStation: (item: string) => void;
    setGeoHash?: (geohash: string) => void;
}) {
    const [result, setResult] = useState<BusStopSearchResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    // const { toast } = useToast();

    const handleSearch = async () => {
        const search = inputRef.current?.value;
        if (search && city) {
            setLoading(true);
            const leafletSearch = () =>
                new Promise<string | undefined>((resolve) => {
                    // const geocoder = L.Control.Geocoder.nominatim();
                    const geocoder = geocoders.nominatim();
                    let geohash;
                    geocoder.geocode(search, (result) => {
                        const r = result[0];
                        if (r) {
                            const { lat, lng } = r?.center;
                            geohash = Geohash.encode(lat, lng, 6) as string;
                            resolve(geohash);
                        }
                        resolve(undefined);
                    });
                });
            leafletSearch().then((data) => {
                // toast({
                //     title: `${data}`,
                // });
                searchStop(search, city, data)
                    .then((data) => {
                        setResult([...data]);
                        setLoading(false);
                    })
                    .catch((err) => alert(err));
            });
        }
    };

    const handleEnter = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && inputRef.current?.value && city) {
            await handleSearch();
        }
    };

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    return (
        <Popup open={open} onClose={() => setOpen(false)}>
            <div className="flex w-[95vw] flex-col  items-center gap-3 rounded-lg bg-white p-4 transition-all md:w-[40rem]">
                <h3 className="w-full text-center text-xl">搜尋站牌</h3>
                <div className="flex w-full gap-2">
                    <Input
                        onKeyDown={handleEnter}
                        ref={inputRef}
                        className="flex-grow text-lg"
                    />
                    <Button onClick={handleSearch} className="bg-slate-700">
                        {loading ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSearch />
                        )}
                    </Button>
                </div>
                <ScrollArea className="w-full">
                    <div className="max-h-[70vh] w-full">
                        {result
                            ?.map((d) => d.StopName.Zh_tw)
                            .filter((d, i, arr) => arr.indexOf(d) === i)
                            .map((item, index) => {
                                return (
                                    <>
                                        {index !== 0 && (
                                            <div className="mx-1 w-full border-t-[0.05rem] border-slate-100" />
                                        )}
                                        <div
                                            onClick={() => {
                                                setOpen(false);
                                                setStation(item);
                                                setGeoHash
                                                    ? setGeoHash(
                                                          result.find(
                                                              (d) =>
                                                                  d.StopName
                                                                      .Zh_tw ===
                                                                  item
                                                          )?.StopPosition
                                                              .GeoHash ?? ""
                                                      )
                                                    : undefined;
                                            }}
                                            key={`${item}`}
                                            className="rounded-md p-2 py-3 transition-all hover:cursor-pointer hover:bg-slate-100"
                                        >
                                            {item}
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </ScrollArea>
                <Button className="w-fit" onClick={() => setOpen(false)}>
                    取消
                </Button>
            </div>
        </Popup>
    );
}
