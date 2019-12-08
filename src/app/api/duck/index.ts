export type Rates = Record<string, Record<string, number>>;

export const UPDATE_RATE = "UPDATE_RATE" as const;

type UpdateAction = {
  type: typeof UPDATE_RATE,
  data: Rates
}

export const updateAction = (data: Rates): UpdateAction => {
  return {
    type: UPDATE_RATE,
    data,
  };
};

export const rates = (
  state = {},
  action: {
    type: string;
    data: Rates;
  }
): Rates => {
  switch (action.type) {
    case UPDATE_RATE:
      return action["data"];
    default:
      return state;
  }
};

export default rates;
