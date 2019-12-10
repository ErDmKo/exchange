import { h } from "preact";
import style from "./style.css";
import { currencyContanier } from "../currency/currencyContanier";
import { topRateContanier } from "../rate/topRateContanier";

export type ExchangeProps = {
  valid?: boolean;
  exchange?: () => void;
  currencies: {
    name: string;
    sigin: string;
  }[];
};

export const exchangeComponent = (props: ExchangeProps) => {
  return h(
    "div",
    {
      className: style["phoneSize"]
    },
    [
      h(
        "div",
        {
          className: [style["exchange"]].join("")
        },
        [
          topRateContanier({
            isFrom: true
          }),
          h(
            "div",
            {
              className: [
                style["button"],
                props.valid ? style["button_active"] : ""
              ].join(" "),
              ["onClick"]: props.exchange,
              id: "exch"
            },
            "Exchange"
          )
        ]
      ),
      h(
        "div",
        {
          className: style["main"]
        },
        [
          currencyContanier({
            ...props,
            isFrom: true
          }),
          currencyContanier({
            ...props,
            isFrom: false
          })
        ]
      )
    ]
  );
};
