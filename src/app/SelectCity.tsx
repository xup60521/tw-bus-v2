"use client";

import { Fragment, useState } from "react";
import ReactSelect from "react-select";
import Link from "next/link";
const list = [
  { label: "台北市", value: "Taipei" },
  { label: "新北市", value: "NewTaipei" },
  { label: "桃園市", value: "Taoyuan" },
  { label: "台中市", value: "Taichung" },
  { label: "台南市", value: "Tainan" },
  { label: "高雄市", value: "Kaohsiung" },
  { label: "基隆市", value: "Keelung" },
  { label: "金門縣", value: "KinmenCounty" },
  { label: "新竹市", value: "Hsinchu" },
  { label: "新竹縣", value: "HsinchuCounty" },
  { label: "苗栗縣", value: "MiaoliCounty" },
  { label: "彰化縣", value: "ChanghuaCounty" },
  { label: "南投縣", value: "NantouCounty" },
  { label: "雲林縣", value: "YunlinCounty" },
  { label: "嘉義縣", value: "ChiayiCounty" },
  { label: "嘉義市", value: "Chiayi" },
  { label: "屏東縣", value: "PingtungCounty" },
  { label: "宜蘭縣", value: "YilanCounty" },
  { label: "花蓮縣", value: "HualienCounty" },
  { label: "台東縣", value: "TaitungCounty" },
  { label: "澎湖縣", value: "PenghuCounty" },
];
export default function SelectCity(): React.ReactNode {
  const [value, setValue] = useState("");

  return (
    <section
      id="start"
      className="flex h-screen w-screen flex-col items-center justify-start gap-4 pt-[10vh] bg-slate-700 text-white"
    >
      <h2 className="font-mono text-3xl">Select a city</h2>
      <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
        <ReactSelect
          placeholder="選擇城市..."
          className="w-48 text-black"
          options={list}
          onChange={(e) => setValue(e?.value ?? "")}
        />
        {list.map((item) => {
          if (!value) {
            return null;
          }
          if (item.value === value) {
            return (
              <Fragment key={item.value}>
              <Link
                className="rounded-lg bg-sky-500 p-2 px-6 font-bold text-white transition-all hover:bg-sky-400"
                href={`/bus/${item.value}`}
              >
                公車
              </Link>
              <Link
                className="rounded-lg bg-sky-500 p-2 px-6 font-bold text-white transition-all hover:bg-sky-400"
                href={`/route/${item.value}`}
              >
                路線圖
              </Link>
              </Fragment>
            );
          }
        })}
      </div>
    </section>
  );
}
