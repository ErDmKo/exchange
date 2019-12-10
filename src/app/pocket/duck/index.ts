import { currencies } from "@src/app/const";
import { combineReducers, Reducer, Action } from "redux";

const poketInitState = currencies.reduce((collector, currency) => {
  collector[currency.name] = 10 + Math.random() * 90;
  return collector;
}, {} as Record<string, number>);

const POCKET_SET = "POCKET_SET";
const POCKET_INCREMENT = "POCKET_INCREMENT";
const POCKET_DECREMENT = "POCKET_DECREMENT";

type PocketAction = {
  val: number;
} & Action<string>;

type PocketState = number;

export const setPokcet = (currency: string, val: number): PocketAction => {
  return {
    type: `${POCKET_SET}_${currency}`,
    val
  };
};

export const addToPokcet = (currency: string, val: number): PocketAction => {
  return {
    type: `${POCKET_INCREMENT}_${currency}`,
    val
  };
};
export const removeFromPokcet = (
  currency: string,
  val: number
): PocketAction => {
  return {
    type: `${POCKET_DECREMENT}_${currency}`,
    val
  };
};

const reducer = combineReducers(
  Object.entries(poketInitState).reduce(
    (collector, [pocketName, pocketVal]) => {
      collector[pocketName] = (state = pocketVal, action: PocketAction) => {
        switch (action.type) {
          case `${POCKET_SET}_${pocketName}`:
            return action.val;
          case `${POCKET_DECREMENT}_${pocketName}`:
            return state - action.val;
          case `${POCKET_INCREMENT}_${pocketName}`:
            return state + action.val;
          default:
            return state;
        }
      };
      return collector;
    },
    {} as Record<string, Reducer<PocketState, PocketAction>>
  )
);

export default reducer;
