import { Dispatch } from "react";
import { updateAction } from "./duck";
import { setToAmount } from "../input/duck";
import { AppStore } from "@src/index";
import { currenciesNames } from "../const";

export const workerConnector = (
  getState: () => AppStore,
  dispatch: Dispatch<any>
) => {
  const fetchWorker: Worker = new Worker("./worker.js");
  fetchWorker.addEventListener("message", function listner(event) {
    if (event.data === "ready") {
      fetchWorker.removeEventListener("message", listner);
    }
    fetchWorker.addEventListener("message", event => {
      dispatch(updateAction(event.data))
      const state = getState();
      if (state.isValid) {
        currenciesNames.forEach((to: string)=> {
          const from = state.currency.from;
          const rate = state.rates[from][to];
          dispatch(
            setToAmount(
              to,
              state.amounts[from].from * rate
            )
          )
        });
      }
    });
  });
};
