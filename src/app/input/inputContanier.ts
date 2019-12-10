import { connect } from "react-redux";
import { inputComponent, InputProps } from "./inputComponent";
import { setFromCurrency, setToCurrency, clearAmounts } from "../rate/duck";
import { setFromAmount, setToAmount } from "./duck";
import { AppStore } from "@src/index";
import { Dispatch, AnyAction } from "redux";
import { currenciesNames } from "../const";
import { setValid, setDirection } from "../exchange/duck";
import { batchActions } from "@src/duck";

export const setAmountsFromState = (
  state: AppStore,
  currency: string,
  val: number,
  dir?: boolean
) => {
  let isValid = true;
  const isFromDirection =
    dir === undefined ? state.exchange.isFromDirection : dir;
  const opositCurrency = isFromDirection
    ? state.currency.to
    : state.currency.from;
  return batchActions(
    ...currenciesNames
      .map<AnyAction>(currencyTo => {
        const rate = state.rates[currency][currencyTo];
        const poketAmount = state.pockets[currencyTo];
        const neededAmount = val * rate;
        const amount = !isFromDirection
          ? Math.min(neededAmount, poketAmount)
          : neededAmount;
        const action = isFromDirection
          ? setToAmount(currencyTo, amount)
          : setFromAmount(currencyTo, amount);
        if (
          isValid &&
          currency !== currencyTo &&
          opositCurrency == currencyTo
        ) {
          isValid = neededAmount <= amount;
        }
        return action;
      })
      .concat(setValid(isValid))
  );
};

const stateToProps = (state: AppStore) => {
  return state;
};

const mergeProps = (
  stateProps: AppStore,
  { dispatch }: { dispatch: Dispatch },
  { currency, isFrom }: InputProps
): InputProps => {
  let maxVal = stateProps.pockets[currency];
  if (!isFrom) {
    const fromCurrency = stateProps.currency.from;
    const fromAmount = stateProps.pockets[fromCurrency];
    maxVal = stateProps.rates[fromCurrency][currency] * fromAmount;
  }
  return {
    isFrom,
    currency,
    isFocused:
      currency ==
        (stateProps.exchange.isFromDirection
          ? stateProps.currency.from
          : stateProps.currency.to) &&
      stateProps.exchange.isFromDirection == isFrom,
    setDirection: (isFrom: boolean, name: string) => {
      dispatch(setDirection(isFrom));
      const action = isFrom ? setFromCurrency(name) : setToCurrency(name);
      dispatch(action);
      const amount = isFrom
        ? stateProps.amounts[currency].from
        : stateProps.amounts[currency].to;
      dispatch(clearAmounts(isFrom, currency));
      dispatch(setAmountsFromState(stateProps, currency, amount, isFrom));
    },
    setValid,
    setAmount: (val: number) => {
      const action = stateProps.exchange.isFromDirection
        ? setFromAmount(currency, val)
        : setToAmount(currency, val);
      dispatch(action);
      dispatch(setAmountsFromState(stateProps, currency, val));
      dispatch(setValid(Boolean(val)));
    },
    maxVal,
    amount: isFrom
      ? stateProps.amounts[currency].from
      : stateProps.amounts[currency].to
  };
};

export const inputContanier = connect(
  stateToProps,
  null as any,
  mergeProps
)(inputComponent as any);
