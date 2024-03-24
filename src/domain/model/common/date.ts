const fromString = (date: string): number => new Date(date).getTime();
const fromTimestamp = (date: number): string => new Date(date).toISOString().split('T').at(0)!;
const createDate = () => fromTimestamp(new Date().getTime());

export {fromString, createDate, fromTimestamp};
