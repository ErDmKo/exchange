import { connect } from "react-redux";
import { inputComponent, InputProps } from "./inputComponent";
import { setCurrency } from "../rate/duck";
import { setFromAmount, setToAmount } from "./duck";
import { AppStore } from "@src/index";
import { Dispatch } from "redux";
import { currenciesNames } from "../const";
import { setValid } from "../exchange/duck";

const stateToProps = (
    state: AppStore
) => {
    return state;
}

const mergeProps = (
    stateProps: AppStore,
    { dispatch }: { dispatch: Dispatch },
    { currency, isFrom }: InputProps
): InputProps => {
    return {
        isFrom,
        currency,
        isFocused: currency == stateProps.currency.from,
        setValid: (val: boolean) => dispatch(setValid(val)),
        selectCurrency: (name: string) => dispatch(setCurrency(name)),
        setAmount: (val: number) => {
            dispatch(
                setFromAmount(currency, val)
            )
            currenciesNames.forEach((currencyTo) => {
                dispatch(
                    setToAmount(
                        currencyTo,
                        val * stateProps.rates[currency][currencyTo]
                    )
                )
            })
            dispatch(setValid(Boolean(val)));
        },
        maxVal: stateProps.pockets[currency],
        amount: isFrom ?
            stateProps.amounts[currency].from :
            stateProps.amounts[currency].to
    }
}

export const inputContanier = connect(
    stateToProps,
    null as any,
    mergeProps
)(inputComponent as any)