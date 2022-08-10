import dayjs from "dayjs";

export const formatSeconds = (timestamp: number) => {
  let totalSeconds = Math.floor(timestamp);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let milliseconds = Math.floor(timestamp % 1 * 1000);
  return `${hours > 0 ? String(hours).padStart(2, "0") : ""}${hours > 0 ? ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`
}

export const getTimeLength = (date: string) => {
  const yearDiff = dayjs().diff(dayjs(date), "y");
  if (yearDiff > 0) {
    return `${yearDiff}yr`
  }
  const monthDiff = dayjs().diff(dayjs(date), "M");
  if (monthDiff > 0) {
    return `${monthDiff}mo`
  }
  const hourDiff = dayjs().diff(dayjs(date), "h");
  if (hourDiff > 36) {
    const dayDiff = dayjs().diff(dayjs(date), "d");
    return `${dayDiff}d`;
  }
  else if (hourDiff > 1) {
    return `${hourDiff}h`;
  }
  else {
    const minuteDiff = dayjs().diff(dayjs(date), "m");
    return `${minuteDiff}m`;
  }
}