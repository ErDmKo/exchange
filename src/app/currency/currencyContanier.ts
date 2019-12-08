import { connect } from "react-redux";
import { AppStore } from "@src/index";
import { currencyComponent, CurrencyProps } from "./currencyComponent";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { setToCurrency, setCurrency } from "../rate/duck";

const stateToProps = (state: AppStore, props: CurrencyProps) => {
    return {
        ...props,
        rates: state.rates,
        from: state.currency.from,
        to: state.currency.to
    }
}
const dispachToProps = (dispach: Dispatch<AnyAction>, props: CurrencyProps) => {
    return {
        ...props,
        selectFrom: (name: string) => {
            dispach(setCurrency(name));
        },
        selectTo: (name: string) => dispach(setToCurrency(name))
    }
}
export const currencyContanier = connect(
    stateToProps,
    dispachToProps
)(currencyComponent as any);