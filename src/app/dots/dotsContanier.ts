import { connect } from "react-redux";
import { setToCurrency, setCurrency } from "@src/app/rate/duck";
import { dotsComponent, DotsProps } from "./dotsComponent";
import { AppStore } from "@src/index";
import { Dispatch } from "redux";

const stateToProps = (
    state: AppStore, {
        isFrom
    }: DotsProps
) => {
    return {
        selectedCurrency: isFrom ?
            state.currency.from : state.currency.to
    }
}

const dispachProps = (dispach: Dispatch, { isFrom }: DotsProps) => {
    return {
        selectCurrency: (name: string) => dispach(
            isFrom ? 
                setCurrency(name) : setToCurrency(name)
        )
    }
}

export const dotsContanier = connect(
    stateToProps,
    dispachProps
)(dotsComponent)