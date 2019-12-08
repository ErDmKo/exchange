import { combineReducers, Action, Reducer } from "redux";
import { currenciesNames } from "@src/app/const";

export const SET_FORM_AMOUNT = 'SET_FROM_AMOUNT_';
export const SET_TO_AMOUNT = 'SET_TO_AMOUNT_';

export type InputAction = {
    val: number
} & Action<string>

export const setFromAmount = (currency: string, val: number): InputAction => {
    return {
        type: `${SET_FORM_AMOUNT}${currency}`,
        val
    }
}
export const setToAmount = (currency: string, val: number): InputAction => {
    return {
        type: `${SET_TO_AMOUNT}${currency}`,
        val
    }
}

const from = (currency: string) => (
    state = 0, 
    action: InputAction
) => {
    switch(action.type) {
        case `${SET_FORM_AMOUNT}${currency}`:
            return action.val
        default:
            return state
    }
}
const to = (currency: string) => (
    state = 0,
    action: InputAction
) => {
    switch(action.type) {
        case `${SET_TO_AMOUNT}${currency}`:
            return action.val
        default:
            return state
    }
}
const reducer = combineReducers(currenciesNames.reduce(
    (coll, currency) => {
        coll[currency] =  combineReducers({
            from: from(currency),
            to: to(currency)
        })
        return coll;
    }, {} as Record<string, Reducer<{
        from: number,
        to: number
    }, InputAction>>)
)
export default reducer;