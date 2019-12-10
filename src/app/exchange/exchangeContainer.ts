import { connect } from "react-redux";
import { exchangeComponent, ExchangeProps } from "./exchangeComponent";
import { currencies, noop } from "../const";
import { AppStore } from "@src/index";
import { Dispatch } from "redux";
import { clearAmounts, setFromCurrency } from "../rate/duck";
import { addToPokcet, removeFromPokcet } from "../pocket/duck";

const stateToProps = (state: AppStore) => {
  return state;
};
const mergeProps = (
  state: AppStore,
  { dispatch }: { dispatch: Dispatch }
): ExchangeProps => {
  return {
    currencies,
    valid: state.exchange.isValid,
    exchange: !state.exchange.isValid
      ? noop
      : () => {
          const { to, from } = state.currency;
          dispatch(removeFromPokcet(from, state.amounts[from].from));
          dispatch(addToPokcet(to, state.amounts[to].to));
          dispatch(setFromCurrency(state.currency.from));
          dispatch(clearAmounts());
        }
  };
};
export const exchangeContanier = connect(
  stateToProps,
  null as any,
  mergeProps
)(exchangeComponent);
