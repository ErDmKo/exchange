import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { h, render } from "preact";
import { ReactInstance } from "react";
import { exchangeContanier } from "./app/exchange/exchangeContainer";
import { workerConnector } from "./app/api/workerConnector";
import rates from "./app/api/duck";
import pockets from "./app/pocket/duck";
import currency from "./app/rate/duck";
import amounts from "./app/input/duck";
import isValid from "./app/exchange/duck";
import { enableBatching } from "./duck";

declare module "preact" {
  export interface Component {
    refs: {
      [key: string]: ReactInstance;
    };
  }
}

const rootReducer = combineReducers({
  isValid,
  rates,
  pockets,
  currency,
  amounts
})
export const store = createStore(
  enableBatching(rootReducer)
);

export type AppStore = ReturnType<typeof store.getState>;

workerConnector(store.getState, store.dispatch);

const mainElem = (props: Record<string, any>) => {
  return h(
      Provider,
      {
        store
      },
      exchangeContanier({})
    )
};
render(h(mainElem, null), window.document.body);
