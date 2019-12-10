import { AnyAction, combineReducers } from "redux";

const DIRECTION_ACTION = "DIRECTION_ACTION" as const;
const VALID_STATE = "VALID_STATE" as const;

export type ValidAction = {
  type: typeof VALID_STATE;
  val: boolean;
} & AnyAction;

export type DirectionAction = {
  type: typeof DIRECTION_ACTION;
  val: boolean;
} & AnyAction;

export const setValid = (val: boolean): ValidAction => {
  return {
    type: VALID_STATE,
    val
  };
};
export const setDirection = (val: boolean): DirectionAction => {
  return {
    type: DIRECTION_ACTION,
    val
  };
};

export const isValidReducer = (state: boolean = false, action: ValidAction) => {
  switch (action.type) {
    case VALID_STATE:
      return action.val;
    default:
      return state;
  }
};
export const directionReducer = (
  state: boolean = true,
  action: DirectionAction
) => {
  switch (action.type) {
    case DIRECTION_ACTION:
      return action.val;
    default:
      return state;
  }
};
export default combineReducers({
  isValid: isValidReducer,
  isFromDirection: directionReducer
});
