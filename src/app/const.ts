export const currencies = [
  {
    name: "USD",
    sigin: "$"
  },
  {
    name: "EUR",
    sigin: "€"
  },
  {
    name: "GBP",
    sigin: "£"
  }
];
export const currenciesNames = currencies.map(e => e.name);

export const noop = () => {};
export const debounce = <T extends Function>(fn: T, time: number): T => {
  let timeout: NodeJS.Timeout;
  return (function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this, ...args), time);
  } as any) as T;
};
