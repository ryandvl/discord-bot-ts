import { getDate } from "./utils/Date";
import { spaceString } from "./utils/Text";

interface AnsiProps {
  [key: string]: number;
}

const COLORS: AnsiProps = {
  RESET: 0,
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  WHITE: 37,

  r: 0,
  "0": 30,
  c: 31,
  a: 32,
  e: 33,
  "1": 34,
  "5": 35,
  b: 36,
  f: 37,
};

const BACKGROUND: AnsiProps = {
  BLACK: 40,
  RED: 41,
  GREEN: 42,
  YELLOW: 43,
  BLUE: 44,
  MAGENTA: 45,
  CYAN: 46,
  WHITE: 47,

  b0: 40,
  bc: 41,
  ba: 42,
  be: 43,
  b1: 44,
  b5: 45,
  bb: 46,
  bf: 47,
};

const TEXT_STYLE: AnsiProps = {
  BOLD: 1,
  FAINT: 2,
  ITALIC: 3,
  UNDERLINED: 4,
  FLASHING: 5,
  REVERSE: 7,

  t1: 1,
  t2: 2,
  t3: 3,
  t4: 4,
  t5: 5,
  t6: 7,
};

function getAnsi(code: number) {
  return `\x1b[${code}m`;
}

function replaceColors(string: string) {
  let newString = string;

  for (const key in COLORS) {
    if (Object.prototype.hasOwnProperty.call(COLORS, key)) {
      let code: number = COLORS[key];
      let regex: RegExp = new RegExp(`&${key.toLowerCase()}`, "g");

      newString = newString.replace(regex, getAnsi(code));
    }
  }

  for (const key in BACKGROUND) {
    if (Object.prototype.hasOwnProperty.call(BACKGROUND, key)) {
      let code: number = BACKGROUND[key];
      let regex: RegExp = new RegExp(`&${key.toLowerCase()}`, "g");

      newString = newString.replace(regex, getAnsi(code));
    }
  }

  for (const key in TEXT_STYLE) {
    if (Object.prototype.hasOwnProperty.call(TEXT_STYLE, key)) {
      let code: number = TEXT_STYLE[key];
      let regex: RegExp = new RegExp(`&${key.toLowerCase()}`, "g");

      newString = newString.replace(regex, getAnsi(code));
    }
  }

  return newString;
}

export function writeLine(string: string, showDateTime: boolean = true) {
  let dateTime = "";

  var { hours, minutes, seconds } = getDate();

  if (showDateTime) dateTime = `&0[${hours}:${minutes}:${seconds}] `;

  console.log(replaceColors(`${dateTime}${string}&r`));

  return true;
}

export function writeEventLine(
  string: string,
  type: string,
  eventName: string
) {
  var { hours, minutes, seconds } = getDate();

  let dateTime = `${hours}:${minutes}:${seconds}`;

  console.log(
    replaceColors(
      `&t2&0[&r&0${dateTime}&t2&0] &t2&0|&r &t1&b${spaceString(
        type.toUpperCase(),
        15
      )}&r &t2&0|&r &t1&5${spaceString(eventName, 15)}&r &t2&0|&r &r${string}&r`
    )
  );

  return true;
}
