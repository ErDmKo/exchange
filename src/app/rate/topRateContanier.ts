import { connect } from "react-redux";
import { AppStore } from "@src/index";
import { RateProps, rateComponent } from "./rateComponent";
import { currencies } from "@src/app/const";

const stateToProps = (state: AppStore, props: RateProps): RateProps => {
  const fromCurrency = currencies.find((currency) => currency.name == state.currency.from);
  const toCurrency = currencies.find((currency) => currency.name == state.currency.to);
  if (!fromCurrency || !toCurrency || !Object.keys(state.rates).length) {
    return props;
  }
  return {
      isFrom: props.isFrom,
      fromName: fromCurrency.name,
      formSigin: fromCurrency.sigin,
      toSigin: toCurrency.sigin,
      toName: toCurrency.name,
      rate: state.rates[fromCurrency.name][toCurrency.name]
  };
};
export const topRateContanier = connect(stateToProps)(rateComponent);
