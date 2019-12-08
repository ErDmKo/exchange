import { connect } from "react-redux";
import { AppStore } from "@src/index";
import { RateProps, rateComponent } from "./rateComponent";
import { currenciesNames, currencies } from "../const";

const stateToProps = (state: AppStore, props: RateProps): RateProps => {
  return {
    ...props,
    toSigin: currencies[currenciesNames.indexOf(state.currency.from)].sigin,
    rate: state.rates[props.fromName!][state.currency.from]
  };
};
export const rateContanier = connect(stateToProps)(rateComponent);
