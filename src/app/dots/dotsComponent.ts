import { h } from "preact";
import { currenciesNames } from "@src/app/const";
import style from "./style.css";

export type DotsProps = {
  isFrom: boolean;
  isFromDirection?: boolean;
  selectedCurrency?: string;
  selectCurrency?: (name: string, isFromDirection: boolean) => void;
};
export const dotsComponent = ({
  isFrom,
  selectedCurrency,
  isFromDirection,
  selectCurrency
}: DotsProps) => {
  return h(
    "div",
    {
      className: style["dots"]
    },
    currenciesNames.map(currency => {
      return h("div", {
        id: `d${isFrom ? "F" : "T"}${currency}`,
        className: [
          style["dots__item"],
          selectedCurrency === currency ? style["active"] : ""
        ].join(" "),
        ["onClick"]: selectCurrency!.bind(null, currency, isFromDirection!)
      });
    })
  );
};
