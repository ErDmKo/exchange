import { h } from "preact";
import style from "./style.css";

export type RateProps = {
  isFrom: boolean,
  fromName?: string;
  formSigin?: string;
  rate?: number;
  toSigin?: string;
  toName?: string;
};

export const rateComponent = ({
  isFrom,
  fromName,
  formSigin,
  toSigin,
  rate 
}: RateProps) => {
  return h(
    "div",
    {
      className: style[isFrom ? "rate": "rate_to"]
    }, formSigin ? [
      h('span', {
        className: style['rate_to__sigin']
      }, formSigin),
      '1 = ',
      h('span', {
        className: style['rate_to__sigin']
      }, toSigin || ""),
      h('span', {
        id: `c${isFrom ? 'F' : 'T'}${fromName}`
      }, (rate || 1).toFixed(2))
    ] : ''
  );
};
