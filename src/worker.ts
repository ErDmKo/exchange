import { currencies } from "./app/const";
import { Rates } from "./app/api/duck";
const postMessageAny = postMessage as any;
const timeoutStep = 10000;
let timeout: any;
const baseUrl = "https://api.exchangeratesapi.io/latest";
const base = "EUR";
const args = {
  ["symbols"]: currencies
    .map(e => e.name)
    .filter(e => e !== base)
    .join(",")
};
const query = Object.entries(args)
  .map(keyVal => keyVal.join("="))
  .join("&");

const currencyNoise = (data: any) => {
  const rawInfo = JSON.stringify(data);
  timeout = setTimeout(() => {
    Object.entries(data).forEach(([_, currncy]: any[]) => {
      Object.entries(currncy).forEach(([key, val]: any[]) => {
        if (_ !== key) {
          currncy[key] = val * (1 + Math.random() / 100);
        }
      });
    });
    postMessageAny(data);
    currencyNoise(JSON.parse(rawInfo));
  }, 1000);
};

const onsucces = (data: any) => {
  let info: Record<string, any> = {};
  try {
    info = JSON.parse(data);
  } catch (e) {
    return console.error(e);
  }
  if (info && info.rates) {
    const rateEntries = Object.entries(
      Object.assign(
        {
          [base]: 1
        },
        info.rates
      ) as Record<string, number>
    );
    // it just rounded values form one request
    const result: Rates = rateEntries.reduce((collect, [sigin, val]) => {
      collect[sigin] = rateEntries.reduce((subCollect, [subSigin, subVal]) => {
        subCollect[subSigin] = subVal / val;
        return subCollect;
      }, {} as Record<string, number>);
      return collect;
    }, {} as Rates);
    postMessageAny(result);
    clearTimeout(timeout);
    currencyNoise(result);
  }
};
const iterator = () => {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}?${query}`, true);
  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        onsucces(xhr.responseText);
        setTimeout(iterator, timeoutStep);
      } else {
        console.error(xhr.statusText);
        setTimeout(iterator, timeoutStep);
      }
    }
  };
  xhr.onerror = function(e) {
    console.error(xhr.statusText);
    setTimeout(iterator, timeoutStep);
  };
  xhr.send(null);
};
iterator();
postMessageAny("ready");
