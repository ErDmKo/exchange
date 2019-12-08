import { AnyAction } from "redux";

const EXCHANGE_ACTION = 'EXCHANGE_ACTION' as const;
const VALID_STATE = 'VALID_STATE' as const;

export type ValidAction = {
    type: typeof VALID_STATE,
    val: boolean
} & AnyAction

export type ExchangeAction = {
    type: typeof EXCHANGE_ACTION,
} & AnyAction


export const exchangeAction = (): ExchangeAction => {
    return {
        type: EXCHANGE_ACTION
    }
}
export const setValid = (val: boolean): ValidAction => {
    return {
        type: VALID_STATE,
        val
    }
}

export const isValidReducer = (
    state: boolean = false,
    action: ValidAction
) => {
    switch(action.type) {
        case VALID_STATE:
            return action.val
        default:
            return state
    }
}
export default isValidReducer