import { Dispatch } from "react";
import { updateAction } from "./duck";
import { AppStore } from "@src/index";
import { setAmountsFromState } from "../input/inputContanier";

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
      dispatch(updateAction(event.data));
      const state = getState();
      const selectedCurrnecy = state.exchange.isFromDirection
        ? state.currency.from
        : state.currency.to;
      const amount = state.exchange.isFromDirection
        ? state.amounts[selectedCurrnecy].from
        : state.amounts[selectedCurrnecy].to;
      if (amount) {
        dispatch(setAmountsFromState(state, selectedCurrnecy, amount));
      }
    });
  });
};
