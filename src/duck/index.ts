import { Reducer, AnyAction } from "redux";
import { AppStore } from "..";

export const  BATCH_ACTIONS = 'BATCH_ACTIONS';

export const batchActions = (...actions: AnyAction[]) => {
    return {
        type: BATCH_ACTIONS,
        actions: actions
    };
}

export const enableBatching = <T extends Function>(reducer: T): T => {
  return function batchingReducer(state: AppStore, action: AnyAction) {
    switch (action.type) {
    case BATCH_ACTIONS:
      return action.actions.reduce(batchingReducer, state);
    default:
      return reducer(state, action);
    } 
  } as any
}