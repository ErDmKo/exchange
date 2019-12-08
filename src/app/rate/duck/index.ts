import { combineReducers } from "redux";
import { currencies, currenciesNames } from "@src/app/const";
import { batchActions } from "@src/duck";
import { setFromAmount, setToAmount } from "@src/app/input/duck";
import { setValid } from "@src/app/exchange/duck";

export const SET_FORM_CURRENCY = 'SET_FROM';
export const SET_TO_CURRENCY = 'SET_TO';

export const setFromCurrency = (name: string) => {
    return {
        type: SET_FORM_CURRENCY,
        name
    }
}
export const setToCurrency = (name: string) => {
    return {
        type: SET_TO_CURRENCY,
        name
    }
}
export const setCurrency = (name: string) => {
    const actions = currenciesNames.map((currency) => {
        return [
            setFromAmount(currency, 0),
            setToAmount(currency, 0)
        ]
    }).reduce((flatMap, a) => flatMap.concat(a), []);
    return batchActions(
        setFromCurrency(name),
        setValid(false),
        ...actions
    )
}
const from = (
    state = currencies[0].name, 
    action: ReturnType<typeof setFromCurrency>
) => {
    switch(action.type) {
        case SET_FORM_CURRENCY:
            return action.name
        default:
            return state
    }
}
const to = (
    state = currencies[1].name,
    action: ReturnType<typeof setFromCurrency>
) => {
    switch(action.type) {
        case SET_TO_CURRENCY:
            return action.name
        default:
            return state
    }
}
const reducer = combineReducers({
    from,
    to
})
export default reducer;