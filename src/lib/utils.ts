import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function RNN(a:string) {
  const regex1 = /^[\u4e00-\u9fa5]/
  const regex2 = /[\u4e00-\u9fa5][0-9]/
  const regex3 = /[\u4e00-\u9fa5A-Z()]/g
  return a.replace(regex1, "").replace(regex2, "").replace(regex3, "")
}

export function LinearToArray(positionStr: string) {
  const regex = /[A-Z()]/g;
  const positionArr = positionStr
    ?.replace(regex, "")
    .split(",")
    .map((f) =>
      f
        .split(" ")
        .reverse()
        .map((item) => Number(item))
    ) as [number, number][];
    return positionArr
}

export const dayOfAWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const cityList = [
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