{
type: uploaded file
fileName: megadroidgames/unirecarga-pix-simples/unirecarga-pix-simples-1b6c0eb0622160fd686538019a7772512c01c312/src/lib/utils.ts
fullContent:
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PixParams {
  key: string;
  name: string;
  city: string;
  amount: number;
  txid?: string;
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid = "***",
}: PixParams) {
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  const format = (id: string, value: string) => {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  };

  const amountStr = amount.toFixed(2);
  const nameStr = normalize(name).substring(0, 25);
  const cityStr = normalize(city).substring(0, 15);

  const merchantAccount =
    format("00", "br.gov.bcb.pix") + format("01", key);

  let payload =
    format("00", "01") +
    format("26", merchantAccount) +
    format("52", "0000") +
    format("53", "986") +
    format("54", amountStr) +
    format("58", "BR") +
    format("59", nameStr) +
    format("60", cityStr) +
    format("62", format("05", txid));

  payload += "6304";

  // CRC16-CCITT (0xFFFF poly 0x1021)
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  const crcHex = (crc & 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");

  return payload + crcHex;
}
}
