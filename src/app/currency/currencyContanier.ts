import { connect } from "react-redux";
import { AppStore } from "@src/index";
import { currencyComponent, CurrencyProps } from "./currencyComponent";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { setToCurrency, clearAmounts, setFromCurrency } from "../rate/duck";

const stateToProps = (state: AppStore) => {
  return {
    rates: state.rates,
    from: state.currency.from,
    to: state.currency.to,
    isFromDirection: state.exchange.isFromDirection
  };
};
const dispachToProps = (
  dispach: Dispatch<AnyAction>,
  { isFrom }: CurrencyProps
) => {
  return {
    selectCurrency: (isFromDirection: boolean, name: string) => {
      if (isFrom == isFromDirection) {
        dispach(clearAmounts());
      }
      dispach(isFrom ? setFromCurrency(name) : setToCurrency(name));
    }
  };
};
export const currencyContanier = connect(
  stateToProps,
  dispachToProps
)(currencyComponent as any);
