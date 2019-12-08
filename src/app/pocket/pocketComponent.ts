import { h } from "preact";
import style from "./style.css";

export type PocketProps = {
  name: string;
  sigin: string;
  val?: number;
};

export const pocketComponent = ({
  name,
  sigin,
  val
}: PocketProps) => {
  return h(
    "div",
    {
      className: style["pocket"]
    },[
      'You have ',
      h('span', {
        className: style["pocket__sigin"]
      }, sigin),
      h('span', {
        id: `p${name}`
      }, Math.abs(val || 0).toFixed(2))
    ]
  );
};
