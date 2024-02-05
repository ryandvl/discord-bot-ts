export function getDate() {
  var dateNow = new Date();
  var date = {
    year: getYear(dateNow),
    month: getMonth(dateNow),
    day: getDay(dateNow),
    hours: getHours(dateNow),
    minutes: getMinutes(dateNow),
    seconds: getSeconds(dateNow),
  };

  return date;
}

export function getYear(date: Date): string {
  return date.getFullYear().toString();
}

export function getMonth(date: Date): string {
  return (date.getMonth() + 1).toString().padStart(2, "0");
}

export function getDay(date: Date): string {
  return date.getDate().toString().padStart(2, "0");
}

export function getHours(date: Date): string {
  return date.getHours().toString().padStart(2, "0");
}

export function getMinutes(date: Date): string {
  return date.getMinutes().toString().padStart(2, "0");
}

export function getSeconds(date: Date): string {
  return date.getSeconds().toString().padStart(2, "0");
}

//#region Ms

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}

export function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

//#endregion
